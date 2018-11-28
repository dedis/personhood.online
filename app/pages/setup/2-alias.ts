/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData } from "tns-core-modules/data/observable";
import { Frame, topmost } from "tns-core-modules/ui/frame";
import Log from "~/lib/Log";

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function goActivate(args: EventData) {
    Log.print("going to activation");

    const topmostFrame: Frame = topmost();
    topmostFrame.navigate("pages/setup/3-activate");
}
