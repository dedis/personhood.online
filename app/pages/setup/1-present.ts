/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData } from "tns-core-modules/data/observable";
import { getFrameById} from "tns-core-modules/ui/frame";
import Log from "~/lib/Log";

Log.print("started 1-present");

export function navigatingTo(args: EventData){
    Log.print("navigatingTo");
}

export function goAlias(args: EventData) {
    Log.print("going to alias");
    return getFrameById("app-root").navigate("pages/setup/2-alias");
}
