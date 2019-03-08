import {Observable} from "tns-core-modules/data/observable";
import {Contact} from "~/lib/Contact";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {contacts, friendsUpdateList, setProgress} from "~/pages/identity/contacts/contacts-page";
import {topmost} from "tns-core-modules/ui/frame";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";
import {assertRegistered, sendCoins} from "~/lib/ui/users";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";

export class RecoverView extends Observable {
    public trustees: ObservableArray<Trustee> = new ObservableArray();
    public maxValue: number;
    public nbrTrustees: number;
    public networkStatus: string;

    constructor() {
        super();

        // Get current trustees
        this.updateTrustees().catch(e => {
            Log.catch(e);
        });
    }

    async updateTrustees() {
        let ts = gData.contact.credential.getAttribute("recover", "trustees");
        this.trustees.splice(0);
        for (let t = 0; t < ts.length; t += 32) {
            let c = await Contact.fromByzcoin(gData.bc, new InstanceID(ts.slice(t, t + 32)));
            this.trustees.push(new Trustee(c));
        }
    }
}

export class Trustee extends Observable {
    private _user: Contact;

    constructor(user: Contact) {
        super();

        this._user = user;
    }

    set user(user: Contact) {
        this._user = user;
    }

    get alias(): string {
        return this._user.alias;
    }

    public async removeTrustee(arg: ItemEventData) {
        if (await dialogs.confirm({
            title: "Remove trustee",
            message: "Are you sure to remove trustee " + this._user.alias + " from your list? " +
                "He will be kept in your contacts list, but not be able to participate in recovery anymore.",
            okButtonText: "Remove",
            cancelButtonText: "Keep",
        })) {
            gData.rmContact(this._user);
            await gData.save();
            friendsUpdateList();
        }
    }

    public async showTrustee(arg: ItemEventData) {
        topmost().showModal("pages/modal/modal-user", this._user,
            () => {
            }, false, false, false);
    }
}
