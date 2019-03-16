import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Darc} from "~/lib/cothority/darc/Darc";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Signer} from "~/lib/cothority/darc/Signer";
import {Log} from "~/lib/Log";
import {Buffer} from "buffer";

export class DarcInstance {
    static readonly contractID = "darc";
    public iid: InstanceID;

    constructor(public bc: ByzCoinRPC, public darc: Darc) {
        this.iid = new InstanceID(darc.getBaseId());
    }

    /**
     * Update the data of this instance
     *
     * @return {Promise<DarcInstance>} - a promise that resolves once the data
     * is up-to-date
     */
    async update(): Promise<DarcInstance> {
        let proof = await this.bc.getProof(new InstanceID(this.darc.getBaseId()));
        let d = DarcInstance.darcFromProof(proof);
        if (d == null){
            return Promise.reject("got null darc");
        }
        this.darc = d;
        return this;
    }

    async evolve(newDarc: Darc, signers: Signer[]) : Promise<any>{
        if (!newDarc.getBaseId().equals(this.darc.getBaseId())){
            return Promise.reject("Not the same base id for the darc");
        }
        newDarc.version = this.darc.version.add(1);
        newDarc.previd = this.darc.getId();
        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "evolve", [
                    new Argument("darc", newDarc.toProto())
                ])]);
        await ctx.signBy([signers], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        await this.update();
    }

    toObject(): any{
        return {
            darc: this.darc.toProto(),
        }
    }

    static fromObject(bc: ByzCoinRPC, obj: any): DarcInstance{
        let d = Darc.fromProto(Buffer.from(obj.darc));
        return new DarcInstance(bc, d);
    }

    static async create(bc: ByzCoinRPC, iid: InstanceID, signers: Signer[], d: Darc): Promise<DarcInstance> {
        let inst = Instruction.createSpawn(iid,
            this.contractID,
            [new Argument("darc", d.toProto())]);
        let ctx = new ClientTransaction([inst]);
        await ctx.signBy([signers], bc);
        await bc.sendTransactionAndWait(ctx, 5);
        return new DarcInstance(bc, d);
    }

    static async fromProof(bc: ByzCoinRPC, p: Proof): Promise<DarcInstance> {
        await p.matchOrFail(DarcInstance.contractID);
        return new DarcInstance(bc, DarcInstance.darcFromProof(p));
    }

    /**
     * Initializes using an existing coinInstance from ByzCoin
     * @param bc
     * @param instID
     */
    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<DarcInstance> {
        return await DarcInstance.fromProof(bc, await bc.getProof(iid));
    }

    static darcFromProof(p: Proof): Darc{
        if (p.contractID != DarcInstance.contractID) {
            Log.error("Got non-darc proof: " + p.contractID);
            return null;
        }
        return Darc.fromProto(p.value);
    }
}
