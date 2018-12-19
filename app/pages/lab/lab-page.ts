import {NavigatedData, Page} from "ui/page";
import {GestureEventData} from "tns-core-modules/ui/gestures";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {Log} from "~/lib/Log";

let frame: any;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = {};
}

export function onNavigatedFrom(args: NavigatedData){
}

export function goCoupons(args: GestureEventData) {
    frame =  args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/lab/coupons/coupons-page",
    })
}
export function goPosts(args: GestureEventData) {
    frame =  args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/lab/posts/posts-page",
    })
}
export function goCoins(args: GestureEventData) {
    frame =  args.view.page.frame;
    return frame.navigate({
        moduleName: "pages/lab/coins/coins-page",
    })
}

export async function switchLab(args: SelectedIndexChangedEventData){
    if (frame) {
        return frame.navigate("pages/manage/manage-page");
    }
}

