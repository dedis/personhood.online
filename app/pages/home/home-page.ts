/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {gData} from "~/lib/Data";
import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import {scanNewUser, sendCoins} from "~/lib/ui/users";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {Label} from "tns-core-modules/ui/label";
import {msgFailed, msgOK} from "~/lib/ui/messages";

let identity = fromObject({
    alias: "unknown",
    qrcode: undefined,
    coins: "0",
    networkStatus: undefined,
    init: true,
});

let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingToHome(args: EventData) {
    Log.lvl2("navigatingTo: home");
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
        identity.set("qrcode", gData.contact.qrcodeIdentity());
        identity.set("init", false);
    } catch (e) {
        Log.catch(e);
    }
}

export function login() {
    return msgOK("Scanning QRCode of login page");
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
        await sendCoins(u, setProgress);
        await updateView();
        await gData.save();
    } catch (e) {
        Log.catch(e);
        await msgFailed("Something unforseen happened: " + e.toString());
    }
    setProgress();
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
