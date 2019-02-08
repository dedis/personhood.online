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
import {Defaults} from "~/lib/Defaults";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {topmost} from "tns-core-modules/ui/frame";

let attributes = new ObservableArray();

let identity = fromObject({
    alias: "unknown",
    qrcode: undefined,
    coins: "0",
    networkStatus: undefined,
    testing: Defaults.TestButtons,
    passport: "default",
    attributes: attributes,
    widthAttributes: "0%",
    widthRegistered: "0%",
    widthMeetups: "0%",
    widthParty: "0%",
    personhoodScore: 0,
    hasCoins: false,
});

let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingToHome(args: EventData) {
    Log.lvl2("navigatingTo: home");
    page = <Page>args.object;
    try {
        page.bindingContext = identity;
        await update();
    } catch (e) {
        Log.catch(e);
    }
}

export function meetup() {
    return msgOK("Confirm presence of others");
}

export function login() {
    return msgOK("Scanning QRCode of login page");
}

export function twoFA() {
    return msgOK("The 2-factor authentication code is: 123 456");
}

let identityShow = 0;

export function personhoodDesc() {
    return topmost().navigate({
        moduleName: "pages/home/personhood/personhood-page"
    });
}

export function cyclePersonhood() {
    Log.print(identityShow);
    switch (identityShow) {
        case 0:
            setScore(3, false, 0, 0);
            break;
        case 1:
            setScore(3, true, 0, 0);
            break;
        case 2:
            setScore(3, true, 30, 0);
            break;
        case 3:
            setScore(3, true, 30, 50);
            break;
        case 4:
            setScore(0, false, 0, 0);
            identityShow = -1;
            break;
    }
    identityShow++;
}

export async function switchHome(args: SelectedIndexChangedEventData) {
    await update();
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

function setScore(att: number, reg: boolean, meet: number, party: number) {
    let attWidth = Math.floor(10 * att / 3);
    identity.set("widthAttributes", attWidth + "%");
    let regWidth = reg ? 10 : 0;
    identity.set("widthRegistered", regWidth + "%");
    let meetWidth = meet;
    identity.set("widthMeetups", meetWidth + "%");
    let partyWidth = party > 0 ? 50 : 0;
    identity.set("widthParty", partyWidth + "%");
    identity.set("personhoodScore", (attWidth + regWidth + meetWidth + partyWidth) + "%");
}

async function update() {
    identity.set("alias", gData.alias);
    attributes.splice(0);
    attributes.push({name: "alias", value: gData.alias});
    if (gData.email != "") {
        attributes.push({name: "email", value: gData.email});
    }
    if (gData.phone != "") {
        attributes.push({name: "phone", value: gData.phone});
    }
    setScore(attributes.length, gData.coinInstance != null, 0, gData.badges.length);
    if (gData.coinInstance != null) {
        identity.set("hasCoins", true);
        await gData.coinInstance.update();
        identity.set("coins", gData.coinInstance.coin.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        identity.set("qrcode", gData.contact.qrcodeIdentity());
        identity.set("init", false);
    }
}

export async function coins(args: EventData) {
    try {
        let u = await scanNewUser(gData);
        await sendCoins(u, setProgress);
        await update();
        await gData.save();
    } catch (e) {
        Log.catch(e);
        await msgFailed("Something unforseen happened: " + e.toString());
    }
}
