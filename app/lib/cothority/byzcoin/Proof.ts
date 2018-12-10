import {ForwardLink} from "~/lib/cothority/skipchain/Structures";
import {SkipBlock} from "~/lib/cothority/skipchain/SkipBlock";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {Log} from "~/lib/Log";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";

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

    get iid(): InstanceID{
        this.matchOrFail();
        return new InstanceID(this.inclusionproof.key);
    }

    get contractID(): string{
        this.matchOrFail();
        return this.stateChangeBody.contractID;
    }

    get darcID(): InstanceID{
        this.matchOrFail();
        return new InstanceID(this.stateChangeBody.darcID);
    }

    get value(): Buffer{
        this.matchOrFail();
        return this.stateChangeBody.value;
    }

    get version(): number{
        this.matchOrFail();
        return this.stateChangeBody.version;
    }

    matchOrFail(){
        if (!this.matches()){
            throw new Error("cannot get instanceID of non-matching proof");
        }
    }

    matches(): boolean{
        return this.inclusionproof.matches();
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
        return Buffer.from(this.leaf.key);
    }

    get value(): Buffer{
        return Buffer.from(this.leaf.value);
    }

    get keyValue(): Buffer[] {
        if (!this.matches()){
            throw new Error("cannot get keyValue from a non-matching proof");
        }
        return [Buffer.from(this.leaf.key), Buffer.from(this.leaf.value)];
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
        this.contractID = Buffer.from(obj.contractid).toString();
        this.value = Buffer.from(obj.value);
        this.version = obj.version;
        this.darcID = Buffer.from(obj.darcid);
    }

    static fromProto(buf: Buffer):StateChangeBody{
        return new StateChangeBody(Root.lookup("byzcoin.StateChangeBody").decode(buf));
    }
}