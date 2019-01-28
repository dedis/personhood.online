/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {getFrameById, Page, topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import {Identity, IdentityViewModel} from "./identity-view";
import {Log} from "~/lib/Log"
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Defaults} from "~/lib/Defaults";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import {mainView, mainViewRegister} from "~/main-page";

let page: Page;
export let adminView: IdentityViewModel;

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    adminView = new IdentityViewModel(gData);
    page.bindingContext = adminView;
}

export async function tapClear(args: EventData) {
    const page = <Page>args.object;
    if (!Defaults.Confirm) {
        gData.delete();
        await gData.save();
        mainViewRegister(args);
    } else {
        if (await dialogs.confirm("Do you really want to delete everything? There is no way back!") &&
            await dialogs.confirm("You will lose all your data! No way back!")) {
            await gData.delete();
            await gData.save();
            await msgOK("ALL YOUR DATA HAS BEEN DELETED!");
            mainView.set("showGroup", 1);
            return getFrameById("setup").navigate({
                moduleName: "pages/setup/1-present",
                // Page navigation, without saving navigation history.
                backstackVisible: false
            });

        }
    }
}

export async function tapSave(args: EventData) {
    try {
        let uid: Identity = page.bindingContext.userId;
        gData.alias = uid.alias;
        gData.email = uid.email;
        await gData.publishPersonhood(uid.publishPersonhood);
        await gData.save();
        await msgOK("Saved your data");
    } catch (e){
        await msgFailed("Something went wrong: " + e.toString());
    }
}

export async function switchSettings(args: SelectedIndexChangedEventData) {
    Log.lvl3("switchSettings", args);
}

