/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {getFrameById, topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import Log from "~/lib/Log";

// Verify if we already have data or not. If it's a new installation, present the project
// and ask for an alias, and set up keys.
export function navigatingTo(args: EventData) {
    Log.print(gData.alias);
    if (gData.alias == "") {
        return getFrameById("app-root").navigate("pages/setup/2-alias");
        // return topmost().navigate("pages/setup/1-present");
    }
}
