import {Log} from "~/lib/Log";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {Frame, getFrameById, topmost} from "tns-core-modules/ui/frame";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";

export let frame: Frame;

export function goFriends(args: GestureEventData) {
    frame = args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/manage/friends/friends-page",
    })
}

export function goPersonhood(args: GestureEventData) {
    frame = args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/manage/personhood/personhood-page",
    })
}

export async function switchManage(args: SelectedIndexChangedEventData) {
    try {
        if (frame) {
            let ret = await frame.navigate("pages/manage/manage-page");
            frame = null;
            return ret;
        }
    } catch (e) {
        Log.catch(e);
    }
}

