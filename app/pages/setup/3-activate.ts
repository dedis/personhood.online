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
import {mainView, mainViewRegister, mainViewRegistered} from "~/main-page";

export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = fromObject({
        alias: gData.alias,
        qrcode: gData.contact.qrcodeIdentity(),
    });
    Log.lvl1("Waiting to activate:\n", gData.contact.qrcodeIdentityStr());
}

export async function verifyActivation(args: EventData){
    try {
        await gData.verifyRegistration();
        if (gData.credentialInstance) {
            await gData.save();
            return gotoMain("Congratulations - you've been registered!", args);
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
    return getFrameById("setup").navigate({
        moduleName: "pages/manage/personhood/personhood-page",
    });
}

// Start by using a Tequila login.
export function activateEPFL(args: EventData) {
    return gotoMain("Do a Tequila login!", args)
}

// Start by activating through email.
export function activateEmail(args: EventData) {
    return gotoMain("Give away your email for activation!", args)
}

export async function deleteAll(args: any) {
    try {
        await gData.delete();
        await gData.save();
    } catch (e) {
        Log.catch(e, "while resetting values");
    }
    return getFrameById("setup").navigate({
        moduleName: "pages/setup/1-present",
        // Page navigation, without saving navigation history.
        backstackVisible: false
    });
    // return gotoMain("Deleted all data");
}

async function gotoMain(msg: string, args: any) {
    await msgOK(msg);
    mainViewRegistered(args);
}
