import {WebSocket, Socket, RosterSocket} from "~/lib/network/NSNet";
import {Roster} from "~/lib/network/Roster";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Log} from "~/lib/Log";
import {RoPaSciInstance, RoPaSciStruct} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";

export class PersonhoodRPC {
    private socket: Socket;

    constructor(public bc: ByzCoinRPC) {
        this.socket = new RosterSocket(bc.config.roster, "Personhood");
    }

    /**
     */
    async listPartiesRPC(id: InstanceID = null): Promise<PersonhoodParty[]> {
        let party = {newparty: null};
        if (id){
            let p = new PersonhoodParty(this.bc.config.roster, new InstanceID(this.bc.bcID), id);
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

    async listRPS(id: InstanceID = null): Promise<RoPaSci[]> {
        let ropasci = {newropasci: null};
        if (id){
            ropasci.newropasci = new RoPaSci(new InstanceID(this.bc.bcID), id).toObject();
        }
        let ropascis: RoPaSci[] = [];
        await Promise.all(this.socket.addresses.map(async addr => {
            let socket = new WebSocket(addr, this.socket.service);
            let resp = await socket.send("RoPaSciList", "RoPaSciListResponse", ropasci);
            if (resp && resp.ropascis) {
                ropascis = ropascis.concat(resp.ropascis.map(r => RoPaSci.fromObject(r)));
            }
        }));
        return ropascis.filter((ropasci, i) => {
            return ropascis.findIndex(p => p.instanceID.equals(ropasci.instanceID)) == i;
        });
    }

    async wipeRPS() {
        let ropasci = {wipe: true};
        await Promise.all(this.socket.addresses.map(async addr => {
            let socket = new WebSocket(addr, this.socket.service);
            let resp = await socket.send("RoPaSciList", "RoPaSciListResponse", ropasci);
        }));
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
export class RoPaSci {
    constructor(public byzcoinID: InstanceID, public instanceID: InstanceID) {
    }

    toObject(): any{
        return {
            byzcoinid: this.byzcoinID.iid,
            ropasciid: this.instanceID.iid,
        }
    }

    static fromObject(obj: any): RoPaSci{
        return new RoPaSci(InstanceID.fromObjectBuffer(obj.byzcoinid),
            InstanceID.fromObjectBuffer(obj.ropasciid));
    }
}