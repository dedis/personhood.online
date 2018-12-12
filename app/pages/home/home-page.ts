/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {Data, gData} from "~/lib/Data";
import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {scan} from "~/lib/Scan";

let identity = fromObject({
    alias: gData.alias,
    qrcode: gData.qrcodeIdentity(),
});

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    try {
        page.bindingContext = identity;
    } catch (e) {
        Log.catch(e);
    }
}

export function login() {
    return dialogs.alert("Scanning QRCode of login page");
}

export async function coins() {
    try {
        let str = await scan("Scan Identity Code");
        Log.lvl2("Got string scanned:", str);
        let qr = Data.parseQRCode(str);
        if (qr.public_ed25519) {
            if (!(gData.coinInstance && gData.spawnerInstance)){
                throw new Error("Cannot sign up a user without coins and spawner");
            }
            await gData.coinInstance.update();
            let scost = gData.spawnerInstance.signupCost;
            if (gData.coinInstance.coin.value.gte(scost)) {
                let pay = await dialogs.confirm("This is an unconfirmed code - do you want to pay " + scost.toString() + " for the registration of " + qr.alias + "?")
                if (pay) {
                    await gData.registerUser(str);
                    await dialogs.alert(qr.alias + " is now registered");
                }
            }
        }
    } catch (e) {
        Log.catch(e);
        await dialogs.alert("Scanning failed:" + e);
    }
}
