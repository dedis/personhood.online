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
        moduleName: "pages/lab/coupons/coupons-page",
    })
}
export function goPosts(args: GestureEventData) {
    return args.view.page.frame.navigate({
        moduleName: "pages/lab/posts/posts-page",
    })
}
export function goCoins(args: GestureEventData) {
    return args.view.page.frame.navigate({
        moduleName: "pages/lab/coins/coins-page",
    })
}