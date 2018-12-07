import {Proof} from "~/lib/cothority/byzcoin/Proof";

export class Instance{
    data: Buffer;
    static fromProof(p: Proof): Instance{
        return new Instance();
    }
}