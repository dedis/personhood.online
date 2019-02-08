import {Observable} from "tns-core-modules/data/observable";
import {Contact} from "~/lib/Contact";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {friendsUpdateList, setProgress} from "~/pages/identity/contacts/contacts-page";
import {topmost} from "tns-core-modules/ui/frame";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";
import {assertRegistered, sendCoins} from "~/lib/ui/users";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import {CredentialStruct} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {Meetup} from "~/lib/PersonhoodRPC";

export class MeetupView extends Observable {
    private _users: UserView[];
    private _networkStatus: string;

    constructor() {
        super();
    }

    updateUsers(users: Meetup[]) {
        this._users = users.map(u => new UserView(u.attributes));
        this.notifyPropertyChange("users", this._users);
    }

    public set networkStatus(str: string){
        this._networkStatus = str;
        this.notifyPropertyChange("networkStatus", this._networkStatus);
    }

    public get networkStatus():string{
        return this._networkStatus;
    }
}

export class UserView extends Observable {
    private _user: CredentialStruct;

    constructor(user: CredentialStruct) {
        super();

        this._user = user;
    }

    set user(user: CredentialStruct) {
        this._user = user;
    }

    get alias(): string{
        return "this._user.alias";
    }

    public async showUser(arg: ItemEventData){
        topmost().showModal("pages/modal/modal-user", this._user,
            ()=>{}, false, false, false);
    }
}
