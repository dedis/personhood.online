/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject, Observable} from "tns-core-modules/data/observable";
import {Frame, getFrameById, Page, topmost} from "tns-core-modules/ui/frame";
import Log from "~/lib/Log";
import {gData} from "~/lib/Data";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {AdminViewModel} from "~/pages/admin/admin-view";

let input = fromObject({
    input: {alias: ""}
});

let page: Page;

export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = input;
}

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function goActivate(args: EventData) {
    let a = page.bindingContext.get("input").alias;
    Log.lvl1("saving alias", a);
    if (a.length == 0) {
        return dialogs.alert("Please enter an alias")
    }
    gData.alias = a;

    getFrameById("app-root").navigate("pages/setup/3-activate");
}
