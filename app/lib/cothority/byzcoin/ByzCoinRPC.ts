import {KeyPair} from "~/lib/KeyPair";
import {Darc, Rule, Rules} from "../darc/Darc";
import {Log} from "~/lib/Log";
import {RosterSocket, Socket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {IdentityEd25519} from "~/lib/cothority/darc/IdentityEd25519";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Signer} from "~/lib/cothority/darc/Signer";
import {SignerEd25519} from "~/lib/cothority/darc/SignerEd25519";
import * as Long from "long";

const UUID = require("pure-uuid");
const crypto = require("crypto-browserify");

export const currentVersion = 1;

export class ByzCoinRPC {
    admin: Signer;
    socket: Socket;
    bcID: Buffer;
    config: ChainConfig;
    genesisDarc: Darc;

    constructor(s: Socket, bcID: Buffer) {
        this.socket = s;
        this.bcID = bcID;
    }

    /**
     * Sends a transaction to byzcoin and waits for up to 'wait' blocks for the
     * transaction to be included in the global state. If more than 'wait' blocks
     * are created and the transaction is not included, an exception will be raised.
     *
     * @param {ClientTransaction} transaction - is the client transaction holding
     * one or more instructions to be sent to byzcoin.
     * @param {number} wait - indicates the number of blocks to wait for the
     * transaction to be included
     * @return {Promise} - a promise that gets resolved if the block has been included
     */
    async sendTransactionAndWait(transaction, wait): Promise<any> {
        let addTxRequest = {
            version: currentVersion,
            skipchainid: this.bcID,
            transaction: transaction.toProtobufValidMessage(),
            inclusionwait: wait
        };
        await this.socket.send("AddTxRequest", "AddTxResponse", addTxRequest);
        return null;
    }

    async updateConfig(): Promise<any> {
        let pr = await this.getProof(new Buffer(32));
        ByzCoinRPC.checkProof(pr, "config");
        this.config = ChainConfig.fromProof(pr);

        let genesisDarcProof = await this.getProof(pr.stateChangeBody.darcID);
        ByzCoinRPC.checkProof(genesisDarcProof, "darc");
        this.genesisDarc = Darc.fromProof(genesisDarcProof);
    }

    async mintCoins(account: Buffer, amount: number): Promise<any> {
        return Promise.resolve();
    }

    /**
     * Gets a proof from byzcoin to show that a given instance is in the
     * global state.

     * @param {Buffer} id - the instance key
     * @return {Promise<Proof>}
     */
    async getProof(id: Buffer): Promise<Proof> {
        return ByzCoinRPC.getProof(this.socket, this.bcID, id);
    }

    /**
     * Gets a proof from byzcoin to show that a given instance is in the
     * global state.
     *
     * @param {Socket|LeaderSocket|RosterSocket} socket - the socket to communicate with the conode
     * @param {Buffer} skipchainId - the skipchain ID (the ID of it's genesis block)
     * @param {Buffer} key - the instance key
     * @return {Promise<Proof>}
     */
    static async getProof(socket, skipchainId, key): Promise<Proof> {
        const getProofMessage = {
            version: currentVersion,
            id: skipchainId,
            key: key
        };
        let reply = await socket.send("GetProof", "GetProofResponse", getProofMessage)
        return new Proof(reply.proof);
    }

    /**
     * Check the validity of the proof
     *
     * @param {Proof} proof
     * @param {string} expectedContract
     * @throws {Error} if the proof is not valid
     */
    static checkProof(proof: Proof, expectedContract: string) {
        if (!proof.inclusionproof.matches()) {
            throw "it is a proof of absence";
        }
        let contract = proof.stateChangeBody.contractID;
        if (!(contract === expectedContract)) {
            throw "contract name is not " + expectedContract + ", got " + contract;
        }
    }

    static defaultGenesisMessage(roster: any, rules: string[], ids: any[]): any {
        if (ids.length == 0) {
            throw new Error("no identities");
        }

        let d = Darc.fromRulesDesc(Rules.fromOwnersSigners(ids, ids), "genesis darc");
        rules.forEach(r => {
            d.rules.list.push(Rule.fromIdentities(r, ids, "|"));
        });

        let rosterPubs = roster.list.map(l => {
            return "ed25519:" + l.public;
        });
        d.rules.list.push(Rule.fromIdentities("invoke:view_change", rosterPubs, "|"));

        return {
            version: 1,
            roster: roster.toObject(),
            genesisdarc: d,
            // 1*10^9 ns = 1s block interval
            blockinterval: 1e9,
        }
    }

    static async newLedger(roster: any): Promise<ByzCoinRPC> {
        let admin = new KeyPair();
        let ids = [new IdentityEd25519(admin._public)];
        let msg = this.defaultGenesisMessage(roster, [], ids);
        let socket = new RosterSocket(roster, RequestPath.BYZCOIN);
        let reply = await socket.send(RequestPath.BYZCOIN_CREATE_GENESIS, RequestPath.BYZCOIN_CREATE_GENESIS_RESPONSE, msg);
        let bc = new ByzCoinRPC(socket, reply.skipblock.hash);
        bc.admin = new SignerEd25519(admin._public, admin._private);
        return bc;
    }
}

export class ChainConfig {
    roster: any;
    blockinterval: Long;
    maxblocksize: Long;

    constructor(cc: any) {
        this.roster = cc.roster;
        this.blockinterval = cc.blockinterval;
        this.maxblocksize = cc.maxblocksize;
    }

    toProto(): Buffer {
        return objToProto(this, "ChainConfig");
    }

    static fromProto(buf: Buffer): ChainConfig {
        Log.print("buffer", new Buffer(buf).toString('hex'));
        const requestModel = Root.lookup("ChainConfig");
        return new ChainConfig(requestModel.decode(buf));
    }

    static fromProof(pr: Proof): ChainConfig {

        return this.fromProto(pr.stateChangeBody.value);
    }
}