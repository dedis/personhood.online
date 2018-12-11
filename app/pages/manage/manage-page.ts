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
    showStack: 0,
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

export function friends() {
    identity.set("showStack", 0);
}

export function badges() {
    identity.set("showStack", 1);
}

export function devices() {
    identity.set("showStack", 2);
}

export function linkID() {
    identity.set("showStack", 3);
}

export function backupRestore() {
    identity.set("showStack", 4);
}