import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Log} from "~/lib/Log";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {SignerEd25519} from "~/lib/cothority/darc/SignerEd25519";
import {Signer} from "~/lib/cothority/darc/Signer";

export class CredentialInstance {
    static readonly contractID = "credential";
    public darcID: InstanceID;

    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public credential: CredentialStruct) {
    }

    async update(): Promise<CredentialInstance> {
        let proof = await this.bc.getProof(this.iid);
        this.darcID = proof.darcID;
        this.credential = CredentialStruct.fromProto(proof.value);
        return this;
    }

    getAttribute(credential: string, attribute: string): Buffer {
        let cred = this.credential.credentials.find(c => c.name == credential);
        if (!cred) {
            return null;
        }
        let att = cred.attributes.find(a => a.name == attribute);
        if (!att) {
            return null;
        }
        return att.value;
    }

    async setAttribute(owner: Signer, credential: string, attribute: string, value: Buffer): Promise<any> {
        let cred = this.credential.credentials.find(c => c.name == credential);
        if (!cred) {
            cred = new Credential(credential, [new Attribute(attribute, value)]);
            this.credential.credentials.push(cred);
        } else {
            let att = cred.attributes.find(a => a.name == attribute);
            if (!att) {
                cred.attributes.push(new Attribute(attribute, value));
            } else {
                att.value = value;
            }
        }
        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "update",
                [new Argument("credential", this.credential.toProto())])
        ]);
        await ctx.signBy([[owner]], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
        return this;
    }

    toObject(): any{
        return {
            iid: this.iid.toObject(),
            struct: this.credential.toProto(),
        }
    }

    static fromObject(bc: ByzCoinRPC, obj: any):CredentialInstance{
        return new CredentialInstance(bc,
            InstanceID.fromObject(obj.iid),
            CredentialStruct.fromProto(Buffer.from(obj.struct)));
    }

    static async fromProof(bc: ByzCoinRPC, p: Proof): Promise<CredentialInstance> {
        await p.matchOrFail(CredentialInstance.contractID);
        let ci = new CredentialInstance(bc, p.requestedIID,
            CredentialStruct.fromProto(p.value));
        ci.darcID = p.darcID;
        return ci;
    }

    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<CredentialInstance> {
        return CredentialInstance.fromProof(bc, await bc.getProof(iid));
    }
}

export class CredentialStruct {
    static readonly protoName = "personhood.CredentialStruct";

    constructor(public credentials: Credential[]) {
    }

    toObject(): object {
        return this;
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), CredentialStruct.protoName)
    }

    static fromProto(buf: Buffer): CredentialStruct {
        let cs = Root.lookup(CredentialStruct.protoName).decode(buf);
        return new CredentialStruct(cs.credentials.map(c => Credential.fromObject(c)));
    }

    static create(): CredentialStruct {
        return new CredentialStruct(null);
    }
}

export class Credential {
    constructor(public name: string, public attributes: Attribute[]) {
    }

    toObject(): object {
        return this;
    }

    static fromObject(o: any): Credential {
        return new Credential(o.name, o.attributes.map(att => Attribute.fromObject(att)));
    }
}

export class Attribute {
    constructor(public name: string, public value: Buffer) {
    }

    toObject(): object {
        return this;
    }

    static fromObject(o: any): Attribute {
        return new Attribute(o.name, Buffer.from(o.value));
    }
}