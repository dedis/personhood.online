/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject} from "tns-core-modules/data/observable";
import {gData} from "~/lib/Data";
import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import {scanNewUser, sendCoins} from "~/lib/ui/users";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {Label} from "tns-core-modules/ui/label";
import {msgFailed, msgOK} from "~/lib/ui/messages";

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingTo(args: EventData) {
    Log.lvl2("navigatingTo: loading page");
}
