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
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {User} from "~/lib/User";
import * as Long from "long";
import {scanNewUser} from "~/lib/ui/friends";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {PersonhoodView} from "~/pages/manage/personhood/personhood-view";

export let elements: PersonhoodView;
let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingTo(args: EventData) {
    page = <Page>args.object;
    elements = new PersonhoodView();
    page.bindingContext = elements;
    await updateList();
}

async function updateList() {
    try {
        elements.updateParties(await gData.getParties());
        elements.updateBadges(await gData.getBadges());
    } catch(e){
        Log.catch(e);
    }
}

export async function addParty(args: GestureEventData) {
    return dialogs.alert("Adding a new party");
    await gData.save();
}
