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
import {Contact} from "~/lib/Contact";
import * as Long from "long";
import {assertRegistered, scanNewUser} from "~/lib/ui/users";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {ItemEventData} from "tns-core-modules/ui/list-view";
import {ContactsView} from "~/pages/identity/contacts/contacts-view";
import {Label} from "tns-core-modules/ui/label";
import {Meetup, PersonhoodRPC} from "~/lib/PersonhoodRPC";
import {MeetupView} from "~/pages/home/meetup/meetup-view";
import {topmost} from "tns-core-modules/ui/frame";

let identity: MeetupView;
let page: Page;
let phrpc: PersonhoodRPC;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingTo(args: EventData) {
    identity = new MeetupView();
    page = <Page>args.object;
    page.bindingContext = identity;
    phrpc = new PersonhoodRPC(gData.bc);
    setProgress("Broadcasting position", 30);
    await phrpc.meetups(new Meetup(gData.contact.credentialInstance.credential, ""));
    await meetupUpdate();
}

export async function meetupUpdate() {
    setProgress("Listening for other broadcasts", 60);
    let ms = await phrpc.listMeetups();
    identity.updateUsers(ms);
    setProgress();
}

export async function addContacts(){
    topmost().goBack();
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
