import {Observable} from "tns-core-modules/data/observable";
import {User} from "~/lib/User";
import {Log} from "~/lib/Log";
import {Data, gData} from "~/lib/Data";
import {friendsUpdateList, setProgress} from "~/pages/manage/friends/friends-page";
import {topmost} from "tns-core-modules/ui/frame";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";
import {Badge} from "~/lib/Badge";
import {Party} from "~/lib/Party";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {fromFile, ImageSource} from "tns-core-modules/image-source";
import {elements} from "~/pages/manage/personhood/personhood-page";
import {Folder, knownFolders, path} from "tns-core-modules/file-system";
import {sprintf} from "sprintf-js";
import {msgOK} from "~/lib/ui/messages";

export class PersonhoodView extends Observable {
    parties: PartyView[] = [];
    badges: BadgeView[] = [];
    networkStatus: string;
    canAddParty: boolean;

    constructor() {
        super();
    }

    get elements(): ViewElement[] {
        let ret: ViewElement[] = [];
        this.parties.forEach(p => ret.push(p));
        this.badges.forEach(b => ret.push(b));
        return ret;
    }

    async updateAddParty() {
        try {
            this.canAddParty = gData.spawnerInstance &&
                await gData.canPay(gData.spawnerInstance.spawner.costParty.value);
        } catch (e) {
            Log.catch(e);
            this.canAddParty = false;
        }
    }

    updateBadges(badges: Badge[]) {
        this.badges = badges.map(b => new BadgeView(b));
        this.notifyPropertyChange("elements", this.elements);
    }

    updateParties(parties: Party[]) {
        this.parties = parties.map(p => new PartyView(p));
        this.notifyPropertyChange("elements", this.elements);
    }
}

interface ViewElement {
    party: Party;
    qrcode: ImageSource;
    icon: ImageSource;
    bgcolor: string;
    showDetails: boolean;
    nextStep: string;
    stepWidth: string;

    onTap(arg: GestureEventData)
}

function getImage(name: string): ImageSource {
    const folder: Folder = <Folder>knownFolders.currentApp();
    const folderPath: string = path.join(folder.path, "images", name);
    return <ImageSource>fromFile(folderPath);
}

export class BadgeView extends Observable {
    party: Party;
    showDetails = false;

    constructor(public badge: Badge) {
        super();
        this.party = badge.party;
    }

    get qrcode(): ImageSource {
        return null;
    }

    get icon(): ImageSource {
        return getImage("icon-personhood-64.png");
    }

    get bgcolor(): string {
        return "badge";
    }

    get nextStep(): string {
        return null;
    }

    get stepWidth(): string {
        return null;
    }

    onTap(arg: GestureEventData) {
        Log.print("Tapped badge")
        let p = this.badge.party;
        return msgOK([p.name, p.desc, p.date, p.location].join("\n"), "Details for badge");
    }
}

export class PartyView extends Observable {
    chosen: boolean;
    showDetails = true;

    constructor(public party: Party) {
        super();
    }

    get qrcode(): ImageSource {
        return (this.chosen && this.party.state == 1) ? this.party.qrcode(gData.keyPersonhood._public) : null;
    }

    get icon(): ImageSource {
        return null;
    }

    get bgcolor(): string {
        if (this.party.isOrganizer) {
            return "party-owner";
        }
        return this.chosen ? "party-participate" : "party-available";
    }

    get nextStep(): string {
        if (this.party.isOrganizer) {
            return ["Waiting for barrier point",
                "Scan attendees' public keys",
                "Finalize the party"][this.party.state % 3];
        }
        if (!this.chosen) {
            return null;
        }
        return ["Go to party",
            "Get your qrcode scanned",
            "Mining coins"][this.party.state % 3];
    }

    get stepWidth(): string {
        if (!this.chosen && !this.party.isOrganizer) {
            return null;
        }
        return sprintf("%d%%", ((this.party.state % 3) + 1) * 25);
    }

    setChosen(c: boolean) {
        this.chosen = c;
        ["bgcolor", "qrcode", "nextStep", "stepWidth"].forEach(
            key => this.notifyPropertyChange(key, this[key]));
    }

    async onTap(arg: GestureEventData) {
        if (this.party.isOrganizer) {
            await msgOK(["Activating barrier point",
                "Scan attendees' public keys",
                "Finalizing party"][(this.party.state++) % 3]);
            this.setChosen(this.chosen);
            return;
        }
        let c = !this.chosen;
        elements.parties.forEach(p => p.setChosen(false));
        this.setChosen(c);
    }
}
