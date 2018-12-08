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

    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public credential: Credential) {
    }

    async update(): Promise<CredentialInstance> {
        let proof = await this.bc.getProof(this.iid);
        this.credential = Credential.fromProto(proof.inclusionproof.value);
        return this;
    }

    static fromProof(bc: ByzCoinRPC, p: Proof): CredentialInstance {
        return new CredentialInstance(bc, p.iid,
            Credential.fromProto(p.value))
    }

    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<CredentialInstance> {
        return CredentialInstance.fromProof(bc, await bc.getProof(iid));
    }
}

export class Credential {
    static readonly protoName = "personhood.Credential";

    constructor(o: any) {

    }

    toObject(): object {
        return {};
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), Credential.protoName)
    }

    static fromProto(buf: Buffer): Credential {
        return new Credential(Root.lookup(Credential.protoName).decode(buf));
    }

    static create(): Credential {
        return new Credential({});
    }
}