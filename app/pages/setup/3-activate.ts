/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {getFrameById, Page, topmost} from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {gData} from "~/lib/Data";
import {Log} from "~/lib/Log";
import {Contact} from "~/lib/Contact";
import {msgFailed, msgOK} from "~/lib/ui/messages";

export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = fromObject({
        alias: gData.alias,
        qrcode: gData.contact.qrcodeIdentity(),
    });
    Log.print(gData.contact.qrcodeIdentityStr());
}

export async function verifyActivation(args: EventData){
    try {
        await gData.verifyRegistration();
        if (gData.credentialInstance) {
            await gData.save();
            return gotoMain("Congratulations - you've been registered!");
        } else {
            return msgFailed("Sorry - your account hasn't been registered yet.")
        }
    } catch (e){
        Log.catch(e);
        await msgFailed("Couldn't contact server: " + e.toString());
    }
}

// Start when included in a party.
export async function activateParty(args: EventData) {
    return getFrameById("app-root").navigate({
        moduleName: "pages/manage/personhood/personhood-page",
    });
}

// Start by using a Tequila login.
export function activateEPFL(args: EventData) {
    return gotoMain("Do a Tequila login!")
}

// Start by activating through email.
export function activateEmail(args: EventData) {
    return gotoMain("Give away your email for activation!")
}

export async function deleteAll() {
    try {
        await gData.setValues({});
        await gData.save();
    } catch (e) {
        Log.catch(e, "while resetting values");
    }
    return gotoMain("Deleted all data");
}

async function gotoMain(msg: string) {
    await msgOK(msg);
    return getFrameById("app-root").navigate({
        moduleName: "main-page",
        // Page navigation, without saving navigation history.
        backstackVisible: false
    });
}
