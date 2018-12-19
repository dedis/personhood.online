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
import {Frame, getFrameById, topmost} from "tns-core-modules/ui/frame";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";

let identity = fromObject({});

export let frame: Frame;

// Event handler for Page "navigatingTo" event attached in identity.xml
export async function navigatingTo(args: GestureEventData) {
    Log.print("navigating to manage page");
    let page = <Page>args.object;
    page.bindingContext = identity;
    // return getFrameById("app-root").navigate("pages/manage/friends/friends-page");
    // await goFriends(args);
}

export function goFriends(args: GestureEventData) {
    Log.print("Going to friends");
    frame = args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/manage/friends/friends-page",
    })
}

export async function switchManage(args: SelectedIndexChangedEventData) {
    try {
        if (frame) {
            return frame.navigate("pages/manage/manage-page");
        }
    } catch (e) {
        Log.catch(e);
    }
}

