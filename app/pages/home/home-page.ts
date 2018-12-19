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
import * as Long from "long";
import {scanNewUser} from "~/lib/ui/friends";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {Label} from "tns-core-modules/ui/label";

let identity = fromObject({
    alias: "unknown",
    qrcode: gData.user.qrcodeIdentity(),
    coins: "0",
    networkStatus: undefined,
});

let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingToHome(args: EventData) {
    page = <Page>args.object;
    try {
        page.bindingContext = identity;
        await updateView();
    } catch (e) {
        Log.catch(e);
    }
}

async function updateView() {
    try {
        identity.set("alias", gData.alias);
        let coins = "0";
        if (gData.coinInstance) {
            await gData.coinInstance.update();
            coins = gData.coinInstance.coin.value.toString();
        }
        identity.set("coins", coins);
        identity.set("qrcode", gData.user.qrcodeIdentity());
    } catch (e) {
        Log.catch(e);
    }
}

export function login() {
    return dialogs.alert("Scanning QRCode of login page");
}

export async function updateCoins() {
    try {
        if (gData.coinInstance) {
            await updateView();
        }
    } catch (e) {
        Log.catch(e);
    }
}

export async function coins(args: EventData) {
    try {
        let u = await scanNewUser(gData);
        if (!u.isRegistered()) {
            if (gData.canPay(gData.spawnerInstance.signupCost)) {
                let pay = await dialogs.confirm("This user is not registered yet - do you want to pay " +
                    gData.spawnerInstance.signupCost.toString() + " for the registration of " + u.alias + "?");
                if (pay) {
                    try {
                        await gData.registerUser(u, Long.fromNumber(0), setProgress);
                        await dialogs.alert({
                            title: "Success",
                            message: u.alias + " is now registered and can be verified.",
                            okButtonText: "Cool"
                        });
                        setProgress();
                    } catch (e) {
                        await dialogs.alert({
                            title: "Error",
                            message: "Couldn't register user: " + e.toString(),
                            okButtonText: "Too bad",
                        });
                        return;
                    }
                }
            } else {
                await dialogs.alert("Cannot register user now");
                return;
            }
        }
        await u.update(gData.bc);

        if (!u.isRegistered()) {
            return dialogs.alert("Cannot send coins to an unregistered user.");
        }
        await gData.coinInstance.update();
        let reply = await dialogs.prompt({
            title: "Send coins",
            message: "How many coins do you want to send to " + u.alias,
            okButtonText: "Send",
            cancelButtonText: "Cancel",
            defaultText: "10000",
        });

        if (reply.result) {
            let coins = Long.fromString(reply.text);
            if (gData.canPay(coins)) {
                setProgress("Sending coins", 50);
                await gData.coinInstance.transfer(coins, u.getCoinAddress(), [gData.keyIdentitySigner]);
                setProgress("Done", 100);
                await dialogs.alert({
                    title: "Success",
                    message: "Transferred " + coins.toString() + " coins to " + u.alias,
                    okButtonText: "Nice",
                });
                setProgress();
            } else {
                return dialogs.alert("You don't have this many coins.");
            }
        }
        await updateView();
        await gData.save();
    } catch (e) {
        Log.catch(e);
        await dialogs.alert({
            title: "Error",
            message: "Something unforseen happened: " + e.toString(),
            okButtonText: "Too bad",
        })
    }
}

export async function switchHome(args: SelectedIndexChangedEventData) {
    await updateCoins();
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
