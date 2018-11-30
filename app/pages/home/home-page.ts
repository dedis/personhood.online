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

export function coins() {
    return dialogs.alert("Send and receive coins");
}
