import {NavigatedData, Page} from "ui/page";
import {GestureEventData} from "tns-core-modules/ui/gestures";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = {};
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