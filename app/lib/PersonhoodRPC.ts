import {WebSocket, Socket, RosterSocket} from "~/lib/network/NSNet";
import {Roster} from "~/lib/network/Roster";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Log} from "~/lib/Log";
import {RoPaSciInstance, RoPaSciStruct} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {randomBytes} from "crypto-browserify";
import {RingSig, Sign} from "~/lib/RingSig";
import {Party} from "~/lib/Party";
import {Private} from "~/lib/KeyPair";
const crypto = require("crypto-browserify");

export class PersonhoodRPC {
    private socket: Socket;

    constructor(public bc: ByzCoinRPC) {
        this.socket = new RosterSocket(bc.config.roster, "Personhood");
    }

    /**
     */
    async listPartiesRPC(id: InstanceID = null): Promise<PersonhoodParty[]> {
        let party = {newparty: null};
        if (id) {
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
        if (id) {
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

    async pollNew(personhood: InstanceID, title: string, description: string, choices: string[]): Promise<PollStruct> {
        let np = new PollStruct(personhood, null, title, description, choices);
        let ps = await this.callPoll(new Poll(this.bc.bcID, np, null, null));
        return ps[0];
    }

    async pollList(partyIDs: InstanceID[]): Promise<PollStruct[]> {
        return this.callPoll(new Poll(this.bc.bcID, null, new PollList(partyIDs), null));
    }

    async pollAnswer(priv: Private, personhood: Party, pollId: Buffer, choice: number): Promise<PollStruct> {
        let context = Buffer.alloc(68);
        context.write("Poll");
        personhood.partyInstance.bc.bcID.copy(context, 4);
        pollId.copy(context, 36);
        let msg = Buffer.alloc(7);
        msg.write("Choice");
        msg.writeUInt8(choice, 6);
        let contextHash = crypto.createHash("sha256");
        contextHash.update(context);
        let lrs = await Sign(msg, personhood.partyInstance.popPartyStruct.attendees.keys, contextHash.digest(), priv);
        let pa = new PollAnswer(pollId, choice, lrs.encode());
        let ps = this.callPoll(new Poll(this.bc.bcID, null, null, pa));
        return ps[0];
    }

    async pollWipe() {
        return this.callPoll(new Poll(this.bc.bcID, null, null, null));
    }

    async callPoll(p: Poll): Promise<PollStruct[]> {
        let resp: PollResponse[] = [];
        await this.callAll("Poll", "PollResponse", p.toObject(), resp);
        let str: PollStruct[] = [];
        resp.forEach(r => {
            if (r) {
                r.polls.forEach(poll => {
                    if (!str.find(s => s.pollID.equals(poll.pollID))) {
                        str.push(poll);
                    }
                })
            }
        });
        return str;
    }

    async callAll(req: string, resp: string, query: any, response: PollResponse[]): Promise<any> {
        return await Promise.all(this.socket.addresses.map(async addr => {
            let socket = new WebSocket(addr, this.socket.service);
            response.push(PollResponse.fromObject(await socket.send(req, resp, query)));
        }));
    }
}

export class PersonhoodParty {
    constructor(public roster: Roster, public byzcoinID: InstanceID, public instanceID: InstanceID) {
    }

    toObject(): any {
        return {
            roster: this.roster.toObject(),
            byzcoinid: this.byzcoinID.iid,
            instanceid: this.instanceID.iid,
        }
    }

    static fromObject(obj: any): PersonhoodParty {
        return new PersonhoodParty(Roster.fromObject(obj.roster),
            InstanceID.fromObjectBuffer(obj.byzcoinid),
            InstanceID.fromObjectBuffer(obj.instanceid))
    }
}

export class RoPaSci {
    constructor(public byzcoinID: InstanceID, public instanceID: InstanceID) {
    }

    toObject(): any {
        return {
            byzcoinid: this.byzcoinID.iid,
            ropasciid: this.instanceID.iid,
        }
    }

    static fromObject(obj: any): RoPaSci {
        return new RoPaSci(InstanceID.fromObjectBuffer(obj.byzcoinid),
            InstanceID.fromObjectBuffer(obj.ropasciid));
    }
}

// Poll allows for adding, listing, and answering to polls
export class Poll {
    constructor(public byzcoinID: Buffer, public newPoll: PollStruct, public list: PollList, public answer: PollAnswer) {
    }

    toObject(): any {
        return {
            byzcoinid: this.byzcoinID,
            newpoll: this.newPoll ? this.newPoll.toObject() : null,
            list: this.list ? this.list.toObject() : null,
            answer: this.answer ? this.answer.toObject() : null,
        }
    }

    static fromObject(obj: any): Poll {
        return new Poll(Buffer.from(obj.byzcoinid), PollStruct.fromObject(obj.newpoll),
            PollList.fromObject(obj.list), PollAnswer.fromObject(obj.answer));
    }
}

// Empty class to request the list of polls available.
export class PollList {
    constructor(public partyIDs: InstanceID[]){}

    toObject(): any {
        return {partyids: this.partyIDs.map(pi => pi.iid)};
    }

    static fromObject(obj: any): PollList {
        if (obj == null) {
            return null;
        }
        return new PollList(obj.partyids.map(pi => InstanceID.fromObjectBuffer(pi)));
    }
}

// PollStruct represents one poll with answers.
export class PollStruct {
    constructor(public personhood: InstanceID, public pollID: Buffer, public title: string,
                public description: string, public choices: string[], public chosen: PollChoice[] = []) {
        if (this.pollID == null) {
            this.pollID = randomBytes(32);
        }
    }

    toObject(): any {
        return {
            personhood: this.personhood.iid,
            pollid: this.pollID,
            title: this.title,
            description: this.description,
            choices: this.choices,
            chosen: this.chosen.map(c => c.toObject()),
        }
    }

    static fromObject(obj: any): PollStruct {
        if (obj == null) {
            return null;
        }
        return new PollStruct(InstanceID.fromObjectBuffer(obj.personhood), Buffer.from(obj.pollid),
            obj.title, obj.description, obj.choices, obj.chosen.map(c => PollChoice.fromObject(c)));
    }

    choiceCount(c: number): number {
        return this.chosen.reduce((prev: number, curr) => {
            return curr.choice == c ? prev + 1 : prev
        }, 0);
    }
}

// PollAnswer stores one answer for a poll. It needs to be signed with a Linkable Ring Signature
// to proof that the choice is unique. The context for the LRS must be
//   'Poll' + ByzCoinID + PollID
// And the message must be
//   'Choice' + byte(Choice)
export class PollAnswer {
    constructor(public pollID: Buffer, public choice: number, public lrs: Buffer) {
    }

    toObject(): any {
        return {
            pollid: this.pollID,
            choice: this.choice,
            lrs: this.lrs,
        }
    }

    static fromObject(obj: any): PollAnswer {
        if (obj == null) {
            return null;
        }
        return new PollAnswer(Buffer.from(obj.pollid), obj.choice, Buffer.from(obj.lrs));
    }
}

// PollChoice represents one choice of one participant.
export class PollChoice {
    constructor(public choice: number, public lrstag: Buffer) {
    }

    toObject(): any {
        return {
            choice: this.choice,
            lrstag: this.lrstag,
        }
    }

    static fromObject(obj: any): PollChoice {
        return new PollChoice(obj.choice, Buffer.from(obj.lrstag));
    }
}

// PollResponse is sent back to the client and contains all known polls.
export class PollResponse {
    constructor(public polls: PollStruct[]) {
    }

    toObject(): any {
        return {
            polls: this.polls.map(p => p.toObject()),
        }
    }

    static fromObject(obj: any): PollResponse {
        return new PollResponse(obj.polls.map(p =>
            PollStruct.fromObject(p)));
    }
}
