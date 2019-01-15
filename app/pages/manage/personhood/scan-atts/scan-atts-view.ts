const crypto = require("crypto-browserify");
import {Observable} from "tns-core-modules/data/observable";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {Party} from "~/lib/Party";
import {Public} from "~/lib/KeyPair";

export class ScanAttsView extends Observable {
    networkStatus: string;
    canAddParty: boolean;

    constructor(public party: Party) {
        super();
    }

    get attendees(): Attendee[] {
        return this.keys.map(k => new Attendee(k));
    }

    get keys(): Public[] {
        return this.party.partyInstance.tmpAttendees;
    }

    get hash(): string {
        let hash = crypto.createHash("sha256");
        let keys = this.keys.map(att => {
            return att.toHex();
        });
        keys.sort();

        keys.forEach(a => {
            hash.update(a);
        });
        return hash.digest().toString('hex').substr(0, 16);
    }

    get size(): number {
        return this.keys.length;
    }

    async addAttendee(att: string) {
        let attPub = Public.fromHex(att);
        if (this.keys.find(k => k.equal(attPub))) {
            return;
        }
        this.keys.push(attPub);
        this.notifyPropertyChange("attendees", this.attendees);
        await gData.save();
    }

    async delAttendee(att: string) {
        let attPub = Public.fromHex(att);
        let pos = this.keys.findIndex(k => k.equal(attPub));
        if (pos < 0) {
            return;
        }
        this.keys.splice(pos, 1);
        this.notifyPropertyChange("attendees", this.attendees);
        await gData.save();
    }
}

class Attendee extends Observable{
    constructor(public att: Public){
        super();
    }

    async onTap(){
        Log.print("tapped", this.hex);
    }

    get hex(): string{
        return this.att.toHex();
    }
}