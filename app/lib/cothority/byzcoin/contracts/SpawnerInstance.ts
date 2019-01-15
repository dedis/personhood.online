import {CredentialStruct, CredentialInstance} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";

const crypto = require("crypto-browserify");

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Darc, Rule, Rules} from "~/lib/cothority/darc/Darc";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Signer} from "~/lib/cothority/darc/Signer";
import * as Long from "long";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Root} from "~/lib/cothority/protobuf/Root";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {IdentityEd25519} from "~/lib/cothority/darc/IdentityEd25519";
import {Buffer} from "buffer";
import {Public} from "~/lib/KeyPair";
import {PopDesc, PopPartyInstance, PopPartyStruct} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {IdentityDarc} from "~/lib/cothority/darc/IdentityDarc";
import {Contact} from "~/lib/Contact";
import {Log} from "~/lib/Log";

let coinName = new Buffer(32);
coinName.write("SpawnerCoin");
export let SpawnerCoin = new InstanceID(coinName);

export class SpawnerInstance {
    static readonly contractID = "spawner";

    /**
     * Creates a new SpawnerInstance
     * @param {ByzCoinRPC} bc - the ByzCoinRPC instance
     * @param {Instance} iid - the complete instance
     * @param {Spawner} spwaner - parameters for the spawner: costs and names
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
        this.spawner = Spawner.fromProto(proof.value);
        return this;
    }

    async createUserDarc(coin: CoinInstance, signers: Signer[], pubKey: any,
                         alias: string):
        Promise<DarcInstance> {
        let d = SpawnerInstance.prepareUserDarc(pubKey, alias);
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(this.spawner.costDarc.value.toBytesLE()))
                ]),
            Instruction.createSpawn(this.iid,
                DarcInstance.contractID, [
                    new Argument("darc", d.toProto())
                ])]);
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

    async createPopParty(coin: CoinInstance, signers: Signer[],
                         orgs: Contact[],
                         descr: PopDesc, reward: Long):
        Promise<PopPartyInstance> {

        // Verify that all organizers have published their personhood public key
        Log.print(orgs[0]);
        let creds = await Promise.all(orgs.map(org => CredentialInstance.fromByzcoin(this.bc, org.credentialIID)));
        Log.print(creds[0]);
        await Promise.all(creds.map(async (cred: CredentialInstance, i: number) =>{
            let pop = cred.getAttribute("personhood", "ed25519");
            if (!pop){
                return Promise.reject("Org " + orgs[i].alias + " didn't publish his personhood key");
            }
        }));

        let orgDarcIDs = orgs.map(org => org.darcInstance.iid);
        let valueBuf = this.spawner.costDarc.value.add(this.spawner.costParty.value).toBytesLE();
        let orgDarc = SpawnerInstance.preparePartyDarc(orgDarcIDs, "party-darc " + descr.name);
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(valueBuf))
                ]),
            Instruction.createSpawn(this.iid,
                DarcInstance.contractID, [
                    new Argument("darc", orgDarc.toProto()),
                ]),
            Instruction.createSpawn(this.iid,
                PopPartyInstance.contractID, [
                    new Argument("darcID", orgDarc.getBaseId()),
                    new Argument("description", descr.toProto()),
                    new Argument("miningReward", Buffer.from(reward.toBytesLE()))
                ])]);
        await ctx.signBy([signers, [], []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        let ppi = PopPartyInstance.fromByzcoin(this.bc, new InstanceID(ctx.instructions[2].deriveId("")));
        return ppi;
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

    static prepareUserDarc(pubKey: Public, alias: string): Darc {
        let id = new IdentityEd25519(pubKey.point);
        let r = Rules.fromOwnersSigners([id], [id]);
        r.list.push(Rule.fromIdentities("invoke:update", [id], "&"));
        r.list.push(Rule.fromIdentities("invoke:fetch", [id], "&"));
        r.list.push(Rule.fromIdentities("invoke:transfer", [id], "&"));
        return Darc.fromRulesDesc(r, "user " + alias);
    }

    static preparePartyDarc(darcIDs: InstanceID[], desc: string): Darc {
        let ids = darcIDs.map(di => new IdentityDarc(di));
        let r = Rules.fromOwnersSigners(ids, ids);
        r.list.push(Rule.fromIdentities("invoke:barrier", ids, "|"));
        r.list.push(Rule.fromIdentities("invoke:finalize", ids, "|"));
        r.list.push(Rule.fromIdentities("invoke:addParty", ids, "|"));
        return Darc.fromRulesDesc(r, desc);
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

