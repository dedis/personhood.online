import {NavigatedData, Page} from "ui/page";
import {AppsViewModel} from "./apps-view-model";
import {GestureEventData} from "tns-core-modules/ui/gestures";

import {topmost} from "tns-core-modules/ui/frame";
import Log from "../../lib/Log";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new AppsViewModel();
}

export function onNavigatedFrom(args: NavigatedData){
}

export function goCoupons(args: GestureEventData) {
    return args.view.page.frame.navigate({
        moduleName: "pages/apps/coupons/coupons-page",
    })
}
export function goPosts(args: GestureEventData) {
    return args.view.page.frame.navigate({
        moduleName: "pages/apps/posts/posts-page",
    })
}
export function goCoins(args: GestureEventData) {
    return args.view.page.frame.navigate({
        moduleName: "pages/apps/coins/coins-page",
    })
}