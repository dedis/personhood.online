import * as Long from "long";

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Darc} from "~/lib/cothority/darc/Darc";
import {Argument, InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Signer} from "~/lib/cothority/darc/Signer";
import {Coin} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {Buffer} from "buffer";
import {Public} from "~/lib/KeyPair";
import {Roster} from "~/lib/network/Roster";

export class PopPartyInstance {
    static readonly contractID = "popParty";

    constructor(public bc: ByzCoinRPC, public iid: InstanceID, public party: PartyStruct) {
    }

    async update(): Promise<PopPartyInstance> {
        let proof = await this.bc.getProof(this.iid);
        this.party = PartyStruct.fromProto(proof.inclusionproof.value);
        return this;
    }

    static fromProof(bc: ByzCoinRPC, p: Proof): PopPartyInstance {
        p.matchOrFail(PopPartyInstance.contractID);
        return new PopPartyInstance(bc, p.requestedIID,
            PartyStruct.fromProto(p.value))
    }

    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<PopPartyInstance> {
        return PopPartyInstance.fromProof(bc, await bc.getProof(iid));
    }
}

export class PartyStruct {
    static readonly protoName = "personhood.PartyStruct";

    /**
     * 	// State has one of the following values:
     // 1: it is a configuration only
     // 2: it is a finalized pop-party
     State int
     // Organizers is the number of organizers responsible for this party
     Organizers int
     // Finalizations is a slice of organizer-darcIDs who agree on the list of
     // public keys in the FinalStatement.
     Finalizations []darc.ID
     // FinalStatement has either only the Desc inside if State == 1, or all fields
     // set if State == 2.
     FinalStatement *FinalStatement
     // Miners holds all tags of the linkable ring signatures that already
     // mined this party.
     Miners []LRSTag
     // How much money to mine
     MiningReward uint64
     // Previous is the link to the instanceID of the previous party, it can be
     // nil for the first party.
     Previous byzcoin.InstanceID
     // Next is a link to the instanceID of the next party. It can be
     // nil if there is no next party.
     Next byzcoin.InstanceID

     * @param name
     */
    constructor(public state: number, public organizers: number, public finalizations: Buffer[],
                public finalStatement: FinalStatement, public miners: LRSTag[],
                public miningReward: Long, public previous: InstanceID, public next: InstanceID) {

    }

    toObject(): object {
        return this;
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), PartyStruct.protoName)
    }

    static fromProto(buf: Buffer): PartyStruct {
        return new PartyStruct(Root.lookup(PartyStruct.protoName).decode(buf).partys);
    }

    static create(): PartyStruct {
        return new PartyStruct(null);
    }
}

export class FinalStatement{
    constructor(public popDesc: PopDesc, public attendees: Attendees){}
}

export class PopDesc{
    constructor(public name: string, public dateTime: string, public location: string, public roster: Roster){}
}

export class Attendees{
    constructor(public attendees: Public[]){}
}

export class LRSTag{
    constructor(public Tag: Buffer){}
}