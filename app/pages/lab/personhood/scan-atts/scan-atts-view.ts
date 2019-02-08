import {viewScanModel} from "~/pages/lab/personhood/scan-atts/scan-atts-page";

const crypto = require("crypto-browserify");
import {Observable} from "tns-core-modules/data/observable";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {Party} from "~/lib/Party";
import {Public} from "~/lib/KeyPair";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {topmost} from "tns-core-modules/ui/frame";

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

    updateAll(){
        this.notifyPropertyChange("attendees", this.attendees);
        this.notifyPropertyChange("hash", this.hash);
    }

    async delete(key: Public){
        await this.party.partyInstance.delAttendee(key);
        await gData.save();
        this.updateAll();
    }

    async addAttendee(att: string) {
        let attPub = Public.fromHex(att);
        if (this.keys.find(k => k.equal(attPub))) {
            return;
        }
        await this.party.partyInstance.addAttendee(attPub);
        await gData.save();
        this.updateAll();
    }

    async delAttendee(att: string) {
        let attPub = Public.fromHex(att);
        let pos = this.keys.findIndex(k => k.equal(attPub));
        if (pos < 0) {
            return;
        }
        this.keys.splice(pos, 1);
        await gData.save();
        this.updateAll();
    }
}

class Attendee extends Observable{
    constructor(public att: Public){
        super();
    }

    async onTap(){
        Log.lvl2("tapped attendee", this.hex);
        let del = "Delete";
        let show = "Show Key";
        let cancel = "Cancel";
        let actions = [del, show]
        switch(await dialogs.action({
            title: "Work Key",
            cancelButtonText: cancel,
            actions: actions,
        })){
            case del:
                viewScanModel.delete(this.att);
                break;
            case show:
                topmost().showModal("pages/modal/modal-key", viewScanModel.party.qrcode(this.att),
                    ()=>{}, false, false, false);
                break;
        }
    }

    get hex(): string{
        return this.att.toHex();
    }
}