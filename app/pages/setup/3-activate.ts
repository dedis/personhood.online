/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {topmost} from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function activatePersonhood(args: EventData) {
    return gotoMain("Get somebody to send you coins!")
}

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function activateParty(args: EventData) {
    return gotoMain("Go to a party!")
}

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function activateEPFL(args: EventData) {
    return gotoMain("Do a Tequila login!")
}

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function activateEmail(args: EventData) {
    return gotoMain("Give away your email for activation!")
}

async function gotoMain(msg: string) {
    await dialogs.alert(msg);
    return topmost().navigate({
        moduleName: "main-page",
        // Page navigation, without saving navigation history.
        backstackVisible: false
    });
}