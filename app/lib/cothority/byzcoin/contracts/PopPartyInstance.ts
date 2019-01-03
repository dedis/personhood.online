import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import * as Long from "long";
import {KeyPair, Public} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";
import {Buffer} from "buffer";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {Signer} from "~/lib/cothority/darc/Signer";
import {CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {User} from "~/lib/User";
import {Data} from "~/lib/Data";
import {promises} from "fs";
import {Sign} from "~/lib/RingSig";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Darc} from "~/lib/cothority/darc/Darc";

export class PopPartyInstance {
    static readonly contractID = "popParty";

    public tmpAttendees: Public[] = [];

    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public popPartyStruct: PopPartyStruct) {
    }

    async getFinalStatement(): Promise<FinalStatement> {
        if (this.popPartyStruct.state != 3) {
            return Promise.reject("this party is not finalized yet");
        }
        return new FinalStatement(this.popPartyStruct.description, this.popPartyStruct.attendees);
    }

    async setBarrier(org: Signer): Promise<number> {
        if (this.popPartyStruct.state != 1) {
            return Promise.reject("barrier point has already been passed");
        }

        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "barrier", [])]);
        await ctx.signBy([[org]], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        await this.update();
        return this.popPartyStruct.state;
    }

    async addAttendee(attendee: Public): Promise<number> {
        if (this.popPartyStruct.state != 2) {
            return Promise.reject("party is not in attendee-adding mode");
        }

        if (this.tmpAttendees.findIndex(pub => pub.point.equal(attendee.point)) >= 0) {
            return Promise.reject("already have this attendee");
        }

        this.tmpAttendees.push(attendee);
    }

    async delAttendee(attendee: Public): Promise<number> {
        if (this.popPartyStruct.state != 2) {
            return Promise.reject("party is not in attendee-adding mode");
        }

        let i = this.tmpAttendees.findIndex(pub => pub.point.equal(attendee.point));
        if (i == -1) {
            return Promise.reject("unknown attendee");
        }
        this.tmpAttendees.splice(i, 1);
        return this.tmpAttendees.length;
    }

    async finalize(org: Signer): Promise<number> {
        if (this.popPartyStruct.state != 2) {
            return Promise.reject("party did not pass barrier-point yet");
        }
        this.popPartyStruct.attendees.keys = this.tmpAttendees;

        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "finalize", [
                    new Argument("attendees", this.popPartyStruct.attendees.toProtobuf())
                ])]);
        await ctx.signBy([[org]], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        await this.update();
        return this.popPartyStruct.state;
    }

    async update(): Promise<PopPartyInstance> {
        let proof = await this.bc.getProof(this.iid);
        await proof.matchOrFail(PopPartyInstance.contractID);
        this.popPartyStruct = PopPartyStruct.fromProto(proof.value);
        return this;
    }

    async mineFromData(att: Data): Promise<any> {
        if (att.coinInstance) {
            await this.mine(att.keyPersonhood, att.coinInstance.iid);
        } else {
            let newDarc = SpawnerInstance.prepareCoinDarc(att.keyIdentity._public, "pop-mined darc");
            await this.mine(att.keyPersonhood, null, newDarc);
            att.coinInstance = await CoinInstance.fromByzcoin(this.bc, SpawnerInstance.coinIID(newDarc.getBaseId()));
            att.darcInstance = DarcInstance.fromProof(this.bc,
                await this.bc.getProof(new InstanceID(newDarc.getBaseId())));
        }
    }

    async mine(att: KeyPair, coin: InstanceID, newDarc: Darc = null): Promise<any> {
        if (this.popPartyStruct.state != 3) {
            return Promise.reject("cannot mine on a non-finalized party");
        }
        let lrs = await Sign(Buffer.from("mine"), this.popPartyStruct.attendees.keys, this.iid.iid, att._private);
        let args = [new Argument("lrs", lrs.encode())];
        if (coin) {
            args.push(new Argument("coinIID", coin.iid));
        } else if (newDarc) {
            args.push(new Argument("newDarc", newDarc.toProto()));
        } else {
            return Promise.reject("neither coin nor darc given");
        }
        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "mine", args)]);
        await this.bc.sendTransactionAndWait(ctx);
        await this.update();
    }

    static async fromProof(bc: ByzCoinRPC, p: Proof): Promise<PopPartyInstance> {
        await p.matchOrFail(PopPartyInstance.contractID);
        return new PopPartyInstance(bc, p.requestedIID,
            PopPartyStruct.fromProto(p.value))
    }

    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<PopPartyInstance> {
        return PopPartyInstance.fromProof(bc, await bc.getProof(iid));
    }
}

export class PopPartyStruct {
    static readonly protoName = "personhood.PopPartyStruct";

    constructor(public state: number,
                public organizers: number,
                public finalizations: string[],
                public description: PopDesc,
                public attendees: Attendees,
                public miners: LRSTag[],
                public miningReward: Long,
                public previous: InstanceID,
                public next: InstanceID) {
    }

    toObject(): object {
        return {
            state: this.state,
            organizers: this.organizers,
            finalizations: this.finalizations,
            description: this.description,
            attendees: this.attendees.toObject(),
            miners: this.miners,
            miningreward: this.miningReward,
            previous: this.previous,
            next: this.next,
        };
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), PopPartyStruct.protoName);
    }

    static fromProto(buf: Buffer): PopPartyStruct {
        let pps = Root.lookup(PopPartyStruct.protoName).decode(buf);
        return new PopPartyStruct(pps.state, pps.organizers, pps.finalizations, pps.description,
            Attendees.fromObject(pps.attendees),
            pps.miners, pps.miningreward, pps.previous, pps.next);
    }
}

export class FinalStatement {
    static readonly protoName = "personhood.FinalStatement";

    constructor(public desc: PopDesc,
                public attendees: Attendees) {
    }

    toObject(): object {
        return {
            desc: this.desc.toObject(),
            attendees: this.attendees.toObject(),
        }
    }

    static fromObject(o: any): FinalStatement {
        return new FinalStatement(PopDesc.fromObject(o.popdesc), Attendees.fromObject(o.attendees));
    }
}

export class PopDesc {
    static readonly protoName = "personhood.PopDesc";

    constructor(public name: string,
                public purpose: string,
                public dateTime: Long,
                public location: string) {
    }

    toObject(): object {
        return {
            name: this.name,
            purpose: this.purpose,
            datetime: this.dateTime,
            location: this.location,
        };
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), PopDesc.protoName);
    }

    static fromObject(o: any): PopDesc {
        return new PopDesc(o.name, o.purpose, o.datetime, o.location);
    }
}

export class Attendees {
    static readonly protoName = "personhood.Attendees";

    constructor(public keys: Public[]) {
    }

    toObject(): object {
        return {
            keys: this.keys.map(k => k.toBuffer())
        };
    }

    toProtobuf(): Buffer {
        return objToProto(this.toObject(), Attendees.protoName);
    }

    static fromObject(o: any): Attendees {
        return new Attendees(o.keys.map(k => Public.fromBuffer(k)));
    }
}

export class LRSTag {
    static readonly protoName = "personhood.LRSTag";

    constructor(public tag: Buffer) {
    }
}