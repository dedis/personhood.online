/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData } from "tns-core-modules/data/observable";
import {getFrameById} from "tns-core-modules/ui/frame";

export function navigatingTo(args: EventData){
}

export function goAlias(args: EventData) {
    return getFrameById("app-root").navigate("pages/setup/2-alias");
}
