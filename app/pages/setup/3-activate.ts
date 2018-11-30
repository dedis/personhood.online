/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {Page, topmost} from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";

export function navigatingTo(args: EventData){
    (<Page>args.object).bindingContext = {};
}

// Start when somebody sends enough coins to create an account.
export function activatePersonhood(args: EventData) {
    return gotoMain("Get somebody to send you coins!")
}

// Start when included in a party.
export function activateParty(args: EventData) {
    return gotoMain("Go to a party!")
}

// Start by using a Tequila login.
export function activateEPFL(args: EventData) {
    return gotoMain("Do a Tequila login!")
}

// Start by activating through email.
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