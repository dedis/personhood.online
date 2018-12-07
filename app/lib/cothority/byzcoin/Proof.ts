import {ForwardLink} from "~/lib/cothority/skipchain/Structures";
import {SkipBlock} from "~/lib/cothority/skipchain/SkipBlock";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {Log} from "~/lib/Log";

export class Proof {
    inclusionproof: InclusionProof;
    latest: SkipBlock;
    links: ForwardLink[];
    stateChangeBody: StateChangeBody;

    constructor(p: any) {
        this.inclusionproof = new InclusionProof(p.inclusionproof);
        this.latest = p.latest;
        this.links = p.links;
        if (this.inclusionproof.matches()) {
            this.stateChangeBody = StateChangeBody.fromProto(this.inclusionproof.value);
        }
    }

    toProto(): Buffer {
        return objToProto(this, "Proof");
    }

    static fromProto(buf: Buffer): Proof {
        return new Proof(Root.lookup('byzcoin.Proof').decode(buf));
    }
}

export class InclusionProof {
    interiors: [];
    leaf: any;
    empty: any;
    nonce: Buffer;
    nohashkey: boolean;

    constructor(ip: any) {
        this.interiors = ip.interiors;
        this.leaf = ip.leaf;
        this.empty = ip.empty;
        this.nonce = ip.nonce;
        this.nohashkey = ip.nohashkey;
    }

    matches(): boolean {
        return this.leaf.key.length !== 0
    }

    get key(): Buffer{
        return new Buffer(this.leaf.key);
    }

    get value(): Buffer{
        return new Buffer(this.leaf.value);
    }

    get keyValue(): Buffer[] {
        if (!this.matches()){
            throw new Error("cannot get keyValue from a non-matching proof");
        }
        return [new Buffer(this.leaf.key), new Buffer(this.leaf.value)];
    }
}

export class StateChangeBody {
    stateAction: number;
    contractID: string;
    value: Buffer;
    version: number;
    darcID: Buffer;

    constructor(obj: any) {
        this.stateAction = obj.stateAction;
        this.contractID = new Buffer(obj.contractid).toString();
        this.value = new Buffer(obj.value);
        this.version = obj.version;
        this.darcID = new Buffer(obj.darcid);
    }

    static fromProto(buf: Buffer):StateChangeBody{
        return new StateChangeBody(Root.lookup("byzcoin.StateChangeBody").decode(buf));
    }
}