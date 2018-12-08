const crypto = require("crypto-browserify");

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Darc, Rules} from "~/lib/cothority/darc/Darc";
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
        let id = new IdentityEd25519(pubKey);
        let r = Rules.fromOwnersSigners([id], [id]);
        let d = Darc.fromRulesDesc(r, desc);
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

    async createCoin(coin: CoinInstance, signers: Signer[], pubKey: any,
                     balance: Long = Long.fromNumber(0)):
        Promise<CoinInstance> {
        let valueBuf = this.spawner.costCoin.value.add(balance).toBytesLE();
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(valueBuf))
                ]),
            Instruction.createSpawn(this.iid,
                DarcInstance.contractID, [
                    new Argument("contractID", Buffer.from("coin")),
                    new Argument("coinName", SpawnerCoin.iid),
                    new Argument("pubKey", pubKey.marshalBinary()),
                ])]);
        await ctx.signBy([signers, []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        let h = crypto.createHash("sha256");
        h.update(Buffer.from("coin"));
        h.update(pubKey.marshalBinary());
        return CoinInstance.fromByzcoin(this.bc, new InstanceID(h.digest()));
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
        return new SpawnerInstance(bc, p.iid,
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
        this.costCred = obj.costcred;
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

