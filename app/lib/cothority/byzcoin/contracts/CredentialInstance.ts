import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Darc} from "~/lib/cothority/darc/Darc";
import {Argument, InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Signer} from "~/lib/cothority/darc/Signer";
import {Coin} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";

export class CredentialInstance {
    static readonly contractID = "credential";

    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public credential: CredentialStruct) {
    }

    async update(): Promise<CredentialInstance> {
        let proof = await this.bc.getProof(this.iid);
        this.credential = CredentialStruct.fromProto(proof.inclusionproof.value);
        return this;
    }

    static fromProof(bc: ByzCoinRPC, p: Proof): CredentialInstance {
        return new CredentialInstance(bc, p.iid,
            CredentialStruct.fromProto(p.value))
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
        return new CredentialStruct(Root.lookup(CredentialStruct.protoName).decode(buf));
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
}

export class Attribute {
    constructor(public name: string, public value: Buffer) {
    }

    toObject(): object {
        return this;
    }
}