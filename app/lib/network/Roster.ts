require("nativescript-nodeify");
import {Rule} from "~/lib/cothority/darc/Darc";

const topl = require("topl");
const UUID = require("pure-uuid");
const crypto = require("crypto-browserify");

import {WebSocket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {DecodeType} from "~/lib/network/DecodeType";
import {Public} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";

export class Roster {
    id: Buffer;
    list: ServerIdentity[];
    aggregate: Public;

    constructor(list: ServerIdentity[]) {
        this.list = list;
        let h = crypto.createHash("sha256");
        this.aggregate = Public.zero();
        list.forEach(l => {
            h.update(l.public);
            this.aggregate.point.add(this.aggregate.point, l.public.point);
        });
        this.id = new UUID(5, "ns:URL", h.digest().toString('hex')).export();
    }

    toObject(): object{
        return {
            id: this.id,
            list: this.list.map(l => l.toObject()),
            aggregate: this.aggregate.toBuffer(),
        }
    }

    static fromObject(obj: any): Roster{
        let pub = Public.fromBuffer(obj.pub);
        return new Roster(obj.list.map(l => new ServerIdentity(pub, l.address, l.description)));
    }

    /**
     * Parse cothority roster toml string into a Roster object.
     * @example
     * // Toml needs to adhere to the following format
     * // where public has to be a hex-encoded string.
     *
     *    [[servers]]
     *        Address = "tcp://127.0.0.1:7001"
     *        Public = "4e3008c1a2b6e022fb60b76b834f174911653e9c9b4156cc8845bfb334075655"
     *        Description = "conode1"
     *    [[servers]]
     *        Address = "tcp://127.0.0.1:7003"
     *        Public = "e5e23e58539a09d3211d8fa0fb3475d48655e0c06d83e93c8e6e7d16aa87c106"
     *        Description = "conode2"
     *
     * @param {kyber.Group} group to construct the identities
     * @param {string} toml of the above format.
     * @param {boolean} wss to connect using WebSocket Secure (port 443)
     *
     * @throws {TypeError} when toml is not a string
     * @return {Roster} roster
     */
    static fromTOML(toml: string, wss: boolean = false): any {
        const roster = topl.parse(toml);
        const list = roster.servers.map(server => {
                let pub = Public.fromHex(server.Public);
                return new ServerIdentity(pub, server.Address, server.Description)
            }
        );
        return new Roster(list);
        // // return new Roster([]);
        // return "";
    }
}

export class ServerIdentity {
    public: Public;
    id: Buffer;
    address: string;
    description: string;

    constructor(pub: Public, a: string, desc: string = "") {
        this.public = pub;
        const hex = pub.toHex();
        const url = "https://dedis.epfl.ch/id/" + hex;
        this.id = new UUID(5, "ns:URL", url).export();
        this.address = a;
        this.description = desc;
    }

    toWebsocket(path: string): string {
        return ServerIdentity.addressToWebsocket(this.address, path);
        //.replace("pop.dedis.ch", "192.168.0.1");
    }

    toObject(): object{
        return {
            public: this.public.toBuffer(),
            id: this.id,
            address: this.address,
            description: this.description,
        }
    }

    /**
     * Checks wether the address given as parameter has the right format.
     * @param {string} address - the address to check
     * @returns {boolean} - true if and only if the address has the right format
     */
    static isValidAddress(address: string): boolean {
        const BASE_URL_TLS = "tls://";
        const URL_PORT_SPLITTER = ":";
        const PORT_MIN = 0;
        const PORT_MAX = 65535;

        if (address.startsWith(BASE_URL_TLS)) {
            let [ip, ...array] = address.replace(BASE_URL_TLS, "").split(URL_PORT_SPLITTER);

            if (array.length === 1) {
                const port = parseInt(array[0]);

                // Port equal to PORT_MAX is not allowed since the port will be increased by one for the websocket urlCred.
                return PORT_MIN <= port && port < PORT_MAX;
            }
        }
        return false;
    }

    static async fromAddress(address: string): Promise<ServerIdentity> {
        if (!ServerIdentity.isValidAddress(address)) {
            return Promise.reject("Invalid address.")
        }

        const statusRequestMessage = {};
        const cothoritySocket = new WebSocket(ServerIdentity.addressToWebsocket(address, ""), RequestPath.STATUS);

        let resp = await cothoritySocket.send(RequestPath.STATUS_REQUEST, DecodeType.STATUS_RESPONSE, statusRequestMessage);
        const keyBuf = Buffer.from(resp.serveridentity.public, 'base64');
        const description = resp.serveridentity.description;
        return new ServerIdentity(Public.fromBuffer(keyBuf), address, description);
    }

    /**
     * Converts a TLS URL to a Wesocket URL and builds a complete URL with the path given as parameter.
     * @param {ServerIdentity|string} serverIdentity - the server identity to take the urlCred from
     * @param {string} path - the path after the base urlCred
     * @returns {string} - the builded websocket urlCred
     */
    static addressToWebsocket(address: string, path: string): string {
        const URL_PORT_SPLITTER = ":";
        const BASE_URL_WS = "ws://";
        const BASE_URL_TLS = "tls://";

        let [ip, portStr] = address.replace(BASE_URL_TLS, "").split(URL_PORT_SPLITTER);
        let port = parseInt(portStr) + 1;

        return BASE_URL_WS + ip + URL_PORT_SPLITTER + port + path;
    }
}
