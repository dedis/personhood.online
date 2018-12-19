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

let users = new ObservableArray();

let identity = fromObject({
    items: ObservableArray,
});

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    identity.set("items", users);
    page.bindingContext = identity;
    updateList();
}

function updateList() {
    users.splice(0);
    gData.users.forEach(u => {
        Log.print("pushing user", u);
        users.push(u);
    })
}

export async function addFriend(args: GestureEventData) {
    let u = await scanNewUser(gData);
    if (!u.isRegistered()) {
        if (gData.canPay(gData.spawnerInstance.signupCost)) {
            Log.print("shall I pay?");
            let pay = await dialogs.confirm("This user is not registered yet - do you want to pay " +
                gData.spawnerInstance.signupCost.toString() + " for the registration of " + u.alias + "?");
            if (pay) {
                await gData.registerUser(u);
                await dialogs.alert(u.alias + " is now registered");
            }
        } else {
            await dialogs.alert("Cannot register user now");
        }
    }
    Log.print("Scanned user", u);
    updateList();
    await gData.save();
}

export async function tapFriend(args: GestureEventData) {
    let user = new User('test');
    let reply = await dialogs.prompt({
        title: "Send coins",
        message: "How many coins do you want to send to " + user.alias,
        okButtonText: "Send",
        cancelButtonText: "Cancel",
        defaultText: "10000",
    });
    if (reply.result) {
        let coins = Long.fromString(reply.text);
        if (gData.canPay(coins)) {
            Log.print("getting address");
            let target = user.getCoinAddress();
            Log.print("got address", target);
            if (target) {
                await gData.coinInstance.transfer(coins, target, [gData.keyIdentitySigner]);
            }
        } else {
            await dialogs.alert("Cannot pay " + coins.toString() + " coins.");
        }
    }
}