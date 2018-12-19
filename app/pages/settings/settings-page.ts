/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {getFrameById, Page, topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import {AdminViewModel} from "./settings-view";
import {Log} from "~/lib/Log"
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Defaults} from "~/lib/Defaults";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";

let page: Page;

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = new AdminViewModel(gData);
}

export async function tapClear(args: EventData) {
    const page = <Page>args.object;
    if (!Defaults.Confirm) {
        gData.setValues({});
        await gData.save();
        Log.print("going to app-root/main-page");
        return topmost().navigate("main-page");
        // return getFrameById("app-root").navigate({
        //     moduleName: "main-page",
        //     // Page navigation, without saving navigation history.
        //     backstackVisible: false
        // });
    } else {
        if (await dialogs.confirm("Do you really want to delete everything? There is no way back!") &&
            await dialogs.confirm("You will lose all your data! No way back!")) {
            await gData.setValues({});
            await gData.save();
            await dialogs.alert("ALL YOUR DATA HAS BEEN DELETED!");
            return getFrameById("app-root").navigate({
                moduleName: "main-page",
                // Page navigation, without saving navigation history.
                backstackVisible: false
            });

        }
    }
}

export function tapCreateParty(args: EventData) {
    return dialogs.alert("You need at least 1e7 coins to do that.")
}

export async function tapSave(args: EventData) {
    gData.setValues(page.bindingContext.admin);
    await gData.save();
}

export async function switchSettings(args: SelectedIndexChangedEventData){
    Log.print("switchSettings", args);
}

