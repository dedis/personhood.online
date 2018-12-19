/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {gData} from "~/lib/Data";
import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {User} from "~/lib/User";
import * as Long from "long";
import {scanNewUser} from "~/lib/ui/friends";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import {FriendsView} from "~/pages/manage/friends/friends-view";
import {Label} from "tns-core-modules/ui/label";

let identity: FriendsView;
let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    identity = new FriendsView(gData.users);
    page = <Page>args.object;
    page.bindingContext = identity;
    friendsUpdateList();
}

export function friendsUpdateList() {
    identity.updateUsers(gData.users);
}

export async function addFriend(args: GestureEventData) {
    let u = await scanNewUser(gData);
    if (!u.isRegistered()) {
        if (gData.canPay(gData.spawnerInstance.signupCost)) {
            let pay = await dialogs.confirm("This user is not registered yet - do you want to pay " +
                gData.spawnerInstance.signupCost.toString() + " for the registration of " + u.alias + "?");
            if (pay) {
                await gData.registerUser(u, Long.fromNumber(0), setProgress);
                await dialogs.alert(u.alias + " is now registered");
            }
        } else {
            await dialogs.alert("Cannot register user now");
        }
    }
    setProgress();
    friendsUpdateList();
    await gData.save();
}

export function setProgress(text: string = "", width: number = 0) {
    if (width == 0) {
        identity.set("networkStatus", undefined);
    } else {
        let color = "#308080;";
        if (width < 0) {
            color = "#a04040";
        }
        page.getViewById("progress_bar").setInlineStyle("width:" + Math.abs(width) + "%; background-color: " + color);
        (<Label>page.getViewById("progress_text")).text = text;
    }
}
