import {Defaults} from "~/lib/Defaults";

const Timer = require("tns-core-modules/timer");
const co = require("co");
const shuffle = require("shuffle-array");
const WS = require("nativescript-websockets");
const Buffer = require("buffer/").Buffer;

import {Log} from "~/lib/Log";
import {Root} from "~/lib/cothority/protobuf/Root";
import {Roster} from "~/lib/network/Roster";

export interface Socket {
    send(request: string, response: string, data: any): Promise<any>;
    addresses: string[];
    service: string;
}

/**
 * Socket is a WebSocket object instance through which protobuf messages are
 * sent to conodes.
 * @param {string} addr websocket address of the conode to contact.
 * @param {string} service name. A socket is tied to a service name.
 *
 * @throws {TypeError} when urlRegistered is not a string or protobuf is not an object
 */
export class WebSocket {
    url: string;
    addresses: string[];

    constructor(addr: string, public service: string) {
        this.addresses = [addr];
        this.url = addr + "/" + service;
    }

    /**
     * Send transmits data to a given urlRegistered and parses the response.
     * @param {string} request name of registered protobuf message
     * @param {string} response name of registered protobuf message
     * @param {object} data to be sent
     *
     * @returns {object} Promise with response message on success, and an error on failure
     */
    async send(request: string, response: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let u = this.url;
            if (Defaults.NetRedirect){
                u = u.replace(Defaults.NetRedirect[0], Defaults.NetRedirect[1]);
            }
            const path = u + "/" + request.replace(/.*\./, '');
            Log.lvl2("Socket: new WebSocketA(" + path + ")");
            const ws = new WS(path, {timeout: 6000});
            let protoMessage = undefined;
            let retry = false;

            const requestModel = Root.lookup(request);
            if (requestModel === undefined) {
                reject(new Error("Model " + request + " not found"));
            }

            const responseModel = Root.lookup(response);
            if (responseModel === undefined) {
                Log.error("failed to find " + response);
                reject(new Error("Model " + response + " not found"));
            }

            let timerId = Timer.setTimeout(() => {
                Log.error("timeout - retrying");
                retry = true;
                ws.close();
            }, 10000);

            ws.on('open', () => {
                const errMsg = requestModel.verify(data);
                if (errMsg) {
                    Log.error("couldn't verify data:", errMsg);
                    reject(new Error(errMsg));
                }
                const message = requestModel.create(data);
                const marshal = requestModel.encode(message).finish();
                ws.send(marshal.slice());
            });

            ws.on('message', (socket, message) => {
                let buffer = new Uint8Array(message);
                Log.lvl3("Getting message with length:", buffer.length);
                try {
                    protoMessage = responseModel.decode(buffer);
                    ws.close();
                } catch (err) {
                    Log.error("got message with length", buffer.length);
                    Log.error("unmarshalling into", responseModel);
                    ws.close();
                    Log.catch(err, "error while decoding, buffer is:", Buffer.from(buffer).toString("hex"));
                    reject(new Error(err));
                }
            });

            ws.on('close', (socket, code, reason) => {
                Timer.clearInterval(timerId);
                if (code == 1006){
                    Log.lvl1("Closed connection at a bad time (1006)", reason);
                    reject(new Error(reason));
                }
                if (!retry || Defaults.Testing) {
                    if (code === 4000) {
                        Log.lvl1("Got close:", code, reason);
                        reject(new Error(reason));
                    }
                    resolve(protoMessage);
                } else {
                    Log.warn("Retrying");
                    retry = false;
                    ws.open();
                }
            });

            ws.on('error', (socket, error) => {
                Log.catch(error, "error in websocket:");
                reject(error);
            });

            ws.open();
        });
    };
}

/*
 * RosterSocket offers similar functionality from the Socket class but chooses
 * a random conode when trying to connect. If a connection fails, it
 * automatically retries to connect to another random server.
 * */
export class RosterSocket {
    addresses: string[];
    service: any;
    lastGoodServer: any;

    constructor(r: Roster, service: string) {
        this.addresses = r.list.map(conode => conode.toWebsocket(""));
        this.service = service;
        this.lastGoodServer = null;
    }

    /**
     * send tries to send the request to a random server in the list as long as there is no successful response. It tries a permutation of all server's addresses.
     *
     * @param {string} request name of the protobuf packet
     * @param {string} response name of the protobuf packet response
     * @param {Object} data javascript object representing the request
     * @returns {Promise} holds the returned data in case of success.
     */
    async send(request: string, response: string, data: any): Promise<any> {
        const that = this;
        const service = that.service;

        // Create a copy of the array else it gets longer after every call to send.
        let addresses = [];
        that.addresses.forEach(addr => {
            addresses.push(addr);
        })
        shuffle(addresses);

        // try first the last good server we know
        if (that.lastGoodServer) {
            delete addresses[addresses.findIndex(addr => {
                return addr == that.lastGoodServer;
            })];
            addresses.unshift(that.lastGoodServer);
        }

        for (let i = 0; i < addresses.length; i++) {
            const addr = addresses[i];
            if (addr == undefined) {
                continue;
            }
            try {
                const socket = new WebSocket(addr, service);
                Log.lvl3("RosterSocket: trying out index " + i + " at address " + addr + "/" + service);
                const socketResponse = await socket.send(request, response, data);
                that.lastGoodServer = addr;
                return socketResponse;
            } catch (err) {
                if (Defaults.Testing){
                    return Promise.reject("quickquit: " + err.toString());
                }
                await Log.rcatch(err, "rostersocket");
            }
        }
        return Promise.reject("no conodes are available or all conodes returned an error");
    }
}

/**
 * LeaderSocket reads a roster and can be used to communicate with the leader
 * node. As of now the leader is the first node in the roster.
 *
 * @throws {Error} when roster doesn't have any node
 */
export class LeaderSocket {
    service: any;
    roster: any;

    constructor(roster, service) {
        this.service = service;
        this.roster = roster;

        if (this.roster.identities.length === 0) {
            throw new Error("Roster should have at least one node");
        }
    }

    /**
     * Send transmits data to a given urlRegistered and parses the response.
     * @param {string} request name of registered protobuf message
     * @param {string} response name of registered protobuf message
     * @param {object} data to be sent
     *
     * @returns {Promise} with response message on success and error on failure.
     */
    send(request, response, data) {
        // fn is a generator that tries the sending the request to the leader
        // maximum 3 times and returns on the first successful attempt
        const that = this;
        const fn = co.wrap(function* () {
            var lastErr
            for (let i = 0; i < 3; i++) {
                try {
                    const socket = new WebSocket(
                        that.roster.identities[0].websocketAddr,
                        that.service
                    );
                    const reply = yield socket.send(request, response, data);
                    return Promise.resolve(reply);
                } catch (err) {
                    Log.catch(err, "error sending request: ");
                    lastErr = err
                }
            }
            return Promise.reject("couldn't send request after 3 attempts: " + lastErr.message);
        });
        return fn();
    }
}
