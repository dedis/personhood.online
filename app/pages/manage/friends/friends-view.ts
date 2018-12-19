import {Observable} from "tns-core-modules/data/observable";
import {User} from "~/lib/User";
import {Log} from "~/lib/Log";
import {gData} from "~/lib/Data";
import {friendsUpdateList, setProgress} from "~/pages/manage/friends/friends-page";
import {topmost} from "tns-core-modules/ui/frame";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";

export class FriendsView extends Observable {
    private _users: UserView[];
    private _networkStatus: string;

    constructor(users: User[]) {
        super();

        // Initialize default values.
        this.updateUsers(users);
    }

    updateUsers(users: User[]) {
        this._users = users.map(u => new UserView(u));
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
    private _user: User;

    constructor(user: User) {
        super();

        this._user = user;
    }

    set user(user: User) {
        this._user = user;
    }

    get alias(): string{
        return this._user.alias;
    }

    public async deleteUser(arg: ItemEventData) {
        gData.rmUser(this._user);
        await gData.save();
        friendsUpdateList();
    }

    public async showUser(arg: ItemEventData){
        topmost().showModal("pages/modal/modal-user", this._user,
            ()=>{}, false, false, false);
    }

    public async payUser(args: ItemEventData) {
        try {
            let reply = await dialogs.prompt({
                title: "Send coins",
                message: "How many coins do you want to send to " + this._user.alias,
                okButtonText: "Send",
                cancelButtonText: "Cancel",
                defaultText: "10000",
            });
            if (reply.result) {
                let coins = Long.fromString(reply.text);
                if (gData.canPay(coins)) {
                    let target = this._user.getCoinAddress();
                    if (target) {
                        setProgress("Transferring coin", 50);
                        await gData.coinInstance.transfer(coins, target, [gData.keyIdentitySigner]);
                        setProgress("Success", 100);
                        await dialogs.alert({
                            title: "Success",
                            message: "Transferred " + coins.toString() + " to " + this._user.alias,
                            okButtonText: "Nice",
                        })
                    }
                } else {
                    await dialogs.alert("Cannot pay " + coins.toString() + " coins.");
                }
            }
        } catch(e){
            Log.catch(e);
        }
        setProgress();
    }

    public async credUser(arg: ItemEventData){
        await dialogs.confirm({
            title: "Credentials of " + this._user.alias,
            message: this._user.credential.credentials.map(
                (c) => {
                    return c.name + ": " + c.attributes[0].name;
                }).join("\n"),
            okButtonText: "OK",
        })
    }
}
