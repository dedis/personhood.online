import {CredentialStruct, CredentialInstance} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";

const crypto = require("crypto-browserify");

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Darc, Rule, Rules} from "~/lib/cothority/darc/Darc";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Signer} from "~/lib/cothority/darc/Signer";
import * as Long from "long";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Log} from "~/lib/Log";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Root} from "~/lib/cothority/protobuf/Root";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {Identity} from "~/lib/cothority/darc/Identity";
import {IdentityEd25519} from "~/lib/cothority/darc/IdentityEd25519";
import {Buffer} from "buffer";
import {Public} from "~/lib/KeyPair";
import {Party, PartyStruct} from "~/lib/Party";

let coinName = new Buffer(32);
coinName.write("SpawnerCoin");
export let SpawnerCoin = new InstanceID(coinName);

export class SpawnerInstance {
    static readonly contractID = "spawner";

    /**
     * Creates a new SpawnerInstance
     * @param {ByzCoinRPC} bc - the ByzCoinRPC instance
     * @param {Instance} [instance] - the complete instance
     */
    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public spawner: Spawner) {
    }

    /**
     * Update the data of this instance
     *
     * @return {Promise<SpawnerInstance>} - a promise that resolves once the data
     * is up-to-date
     */
    async update(): Promise<SpawnerInstance> {
        let proof = await this.bc.getProof(this.iid);
        this.spawner = Spawner.fromProto(proof.inclusionproof.value);
        return this;
    }

    async createDarc(coin: CoinInstance, signers: Signer[], pubKey: any,
                     desc: string):
        Promise<DarcInstance> {
        let d = SpawnerInstance.prepareDarc(pubKey, desc);
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(this.spawner.costDarc.value.toBytesLE()))
                ]),
            Instruction.createSpawn(this.iid,
                DarcInstance.contractID, [
                    new Argument("contractID", Buffer.from("darc")),
                    new Argument("darc", d.toProto())
                ])])
        await ctx.signBy([signers, []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        return DarcInstance.fromByzcoin(this.bc, new InstanceID(d.getBaseId()));
    }

    async createCoin(coin: CoinInstance, signers: Signer[], darcID: Buffer,
                     balance: Long = Long.fromNumber(0)):
        Promise<CoinInstance> {
        let valueBuf = this.spawner.costCoin.value.add(balance).toBytesLE();
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(valueBuf))
                ]),
            Instruction.createSpawn(this.iid,
                CoinInstance.contractID, [
                    new Argument("coinName", SpawnerCoin.iid),
                    new Argument("darcID", darcID),
                ])]);
        await ctx.signBy([signers, []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        return CoinInstance.fromByzcoin(this.bc, SpawnerInstance.coinIID(darcID));
    }

    async createCredential(coin: CoinInstance, signers: Signer[], darcID: Buffer,
                           cred: CredentialStruct):
        Promise<CredentialInstance> {
        let valueBuf = this.spawner.costCred.value.toBytesLE();
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(valueBuf))
                ]),
            Instruction.createSpawn(this.iid,
                CredentialInstance.contractID, [
                    new Argument("darcID", darcID),
                    new Argument("credential", cred.toProto()),
                ])]);
        await ctx.signBy([signers, []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        return CredentialInstance.fromByzcoin(this.bc, SpawnerInstance.credentialIID(darcID));
    }

    async createParty(coin: CoinInstance, signers: Signer[], darcID: Buffer,
                           party: PartyStruct):
        Promise<PartyInstance> {
        let valueBuf = this.spawner.costCred.value.toBytesLE();
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(valueBuf))
                ]),
            Instruction.createSpawn(this.iid,
                CredentialInstance.contractID, [
                    new Argument("darcID", darcID),
                    new Argument("credential", cred.toProto()),
                ])]);
        await ctx.signBy([signers, []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        return CredentialInstance.fromByzcoin(this.bc, SpawnerInstance.credentialIID(darcID));
    }

    get signupCost(): Long {
        return this.spawner.costCoin.value.add(this.spawner.costDarc.value).add(this.spawner.costCred.value);
    }

    static async create(bc: ByzCoinRPC, iid: InstanceID, signers: Signer[],
                        costDarc: Long, costCoin: Long,
                        costCred: Long, costParty: Long,
                        beneficiary: InstanceID): Promise<SpawnerInstance> {
        let args =
            [["costDarc", costDarc],
                ["costCoin", costCoin],
                ["costCredential", costCred],
                ["costParty", costParty]].map(cost =>
                new Argument(<string>cost[0],
                    Coin.create(SpawnerCoin, <Long>cost[1]).toProto()));
        args.push(new Argument("beneficiary", beneficiary.iid));
        let inst = Instruction.createSpawn(iid, this.contractID, args);
        let ctx = new ClientTransaction([inst]);
        await ctx.signBy([signers], bc);
        await bc.sendTransactionAndWait(ctx, 5);
        return this.fromByzcoin(bc, new InstanceID(inst.deriveId()));
    }

    static fromProof(bc: ByzCoinRPC, p: Proof): SpawnerInstance {
        p.matchOrFail(SpawnerInstance.contractID);
        return new SpawnerInstance(bc, p.requestedIID,
            Spawner.fromProto(p.value));
    }

    /**
     * Initializes using an existing coinInstance from ByzCoin
     * @param bc
     * @param instID
     */
    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<SpawnerInstance> {
        return this.fromProof(bc, await bc.getProof(iid));
    }

    static prepareDarc(pubKey: Public, desc: string): Darc {
        let id = new IdentityEd25519(pubKey.point);
        let r = Rules.fromOwnersSigners([id], [id]);
        r.list.push(Rule.fromIdentities("invoke:fetch", [id], "&"));
        r.list.push(Rule.fromIdentities("invoke:transfer", [id], "&"));
        return Darc.fromRulesDesc(r, desc);
    }

    static darcIID(pubKey: Public, desc: string): InstanceID {
        return new InstanceID(SpawnerInstance.prepareDarc(pubKey, desc).getBaseId());
    }

    static credentialIID(darcBaseID: Buffer): InstanceID {
        let h = crypto.createHash("sha256");
        h.update(Buffer.from("credential"));
        h.update(darcBaseID);
        return new InstanceID(h.digest());
    }

    static coinIID(darcBaseID: Buffer): InstanceID {
        let h = crypto.createHash("sha256");
        h.update(Buffer.from("coin"));
        h.update(darcBaseID);
        return new InstanceID(h.digest());
    }
}

export class Spawner {
    static readonly protoName = "personhood.SpawnerStruct";

    costDarc: Coin;
    costCoin: Coin;
    costCred: Coin;
    costParty: Coin;
    beneficiary: InstanceID;

    constructor(obj: any) {
        this.costDarc = obj.costdarc;
        this.costCoin = obj.costcoin;
        this.costCred = obj.costcredential;
        this.costParty = obj.costparty;
        this.beneficiary = obj.beneficiary;
    }

    toObject(): object {
        return {
            costdarc: this.costDarc,
            costcoin: this.costCoin,
            costcred: this.costCred,
            costparty: this.costParty,
            beneficiary: this.beneficiary ? this.beneficiary.iid : Buffer.alloc(32),
        }
    }

    static fromProto(buf: Buffer): Spawner {
        return new Spawner(Root.lookup("SpawnerStruct").decode(buf));
    }
}

