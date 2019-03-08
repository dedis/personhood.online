/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {Page} from "tns-core-modules/ui/page";
import {topmost} from "tns-core-modules/ui/frame";
import {RecoverView} from "~/pages/identity/recover/recover-view";

let page: Page;
let recoverView: RecoverView;

// Event handler for Page "navigatingTo" event attached in identity.xml
export function navigatingTo(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = new RecoverView();
}

export function goBack(){
    topmost().goBack();
}