import {WebSocket, Socket} from "~/lib/network/NSNet";
import {Roster} from "~/lib/network/Roster";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Log} from "~/lib/Log";

export class PersonhoodRPC {
    constructor(public socket: Socket) {
    }

    /**
     */
    async listPartiesRPC(p: PersonhoodParty = null): Promise<PersonhoodParty[]> {
        let party = {newparty: null};
        if (p){
            party.newparty = p.toObject();
        }
        let parties: PersonhoodParty[] = [];
        await Promise.all(this.socket.addresses.map(async addr => {
            let socket = new WebSocket(addr, this.socket.service);
            let resp = await socket.send("PartyList", "PartyListResponse", party);
            parties = parties.concat(resp.parties.map(r => PersonhoodParty.fromObject(r)));
        }));
        return parties.filter((party, i) => {
            return parties.findIndex(p => p.instanceID.equals(party.instanceID)) == i;
        });
    }
}

export class PersonhoodParty {
    constructor(public roster: Roster, public byzcoinID: InstanceID, public instanceID: InstanceID) {
    }

    toObject(): any{
        return {
            roster: this.roster.toObject(),
            byzcoinid: this.byzcoinID.iid,
            instanceid: this.instanceID.iid,
        }
    }

    static fromObject(obj: any): PersonhoodParty{
        return new PersonhoodParty(Roster.fromObject(obj.roster),
            InstanceID.fromObjectBuffer(obj.byzcoinid),
            InstanceID.fromObjectBuffer(obj.instanceid))
    }
}