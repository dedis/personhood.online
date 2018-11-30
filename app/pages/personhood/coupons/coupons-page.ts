// import {EventData, Frame, Observable, topmost, View} from "ui/frame";
// import {NavigatedData, Page} from "ui/page";
// import {CouponsViewModel} from "./coupons-view-model";
// import {ObservableArray} from "tns-core-modules/data/observable-array";
// import {fromObject} from "tns-core-modules/data/observable";
// import * as dialogs from "tns-core-modules/ui/dialogs";
//
// let lib = require("~/lib");
// let Scan = lib.Scan;
// let Convert = lib.Convert;
// let RingSig = lib.crypto.RingSig;
// let FileIO = lib.FileIO;
// let FilePaths = lib.FilePaths;
// let Coupon = lib.Coupon;
// import {Log} from "~/lib/Log";
// import {ItemEventData} from "tns-core-modules/ui/list-view";
//
// let view: View = undefined;
// let coupons: any[] = undefined;
//
// export function onNavigatingTo(args: NavigatedData) {
//     view = <View>args.object;
//
//     view.bindingContext = fromObject({
//         items: new ObservableArray(),
//         isEmpty: true,
//     });
//     return updateCoupons();
// }
//
// export function onBack() {
//     topmost().goBack();
// }
//
// function updateCoupons() {
//     view.bindingContext.items.splice(0);
//     coupons = [];
//     view.bindingContext.isEmpty = true;
//     if (gData.badges.length > 0) {
//         let cs: any[] = [];
//         FileIO.forEachFolderElement(FilePaths.COUPON_PATH, function (barFolder) {
//             Log.print("loading coupon", barFolder.name);
//             cs.push(new Coupon(barFolder.name)
//                 .catch(err => {
//                     Log.catch(err);
//                     return null;
//                 }));
//         });
//         return Promise.all(cs)
//             .then(cs => {
//                 cs.forEach((c: any) => {
//                     Log.print("Found coupon:", c);
//                     if (!c) {
//                         Log.print("invalid coupon");
//                         return;
//                     }
//                     coupons.push(c);
//                     view.bindingContext.isEmpty = false;
//                     // Observables have to be nested to reflect changes
//                     view.bindingContext.items.push(fromObject({
//                         coupon: c,
//                         desc: c.getConfigModule(),
//                     }));
//                 });
//             });
//     }
// }
//
// export function addCoupon(args: EventData) {
//     const badges = gData.badges;
//     if (badges.length == 0) {
//         return dialogs.alert("Please get a badge first.");
//     }
//     return Scan.scan()
//         .then(resultJSON => {
//             const conf = Convert.jsonToObject(resultJSON);
//             return Coupon.createWithConfig(conf.name, conf.frequency, new Date(+conf.date), badges[0])
//         })
//         .then(() => {
//             updateCoupons();
//         })
//         .catch(err => {
//             Log.catch(err);
//         })
// }
//
// export function couponTapped(args: ItemEventData) {
//     let c = coupons[args.index];
//     const actionRequest = "Request the good";
//     const actionShare = "Share the coupon";
//     const actionDelete = "Delete the coupon";
//     return dialogs.action({
//         message: "How to use your coupon?",
//         cancelButtonText: "Cancel",
//         actions: [actionRequest, actionShare, actionDelete]
//     }).then(result => {
//         switch (result) {
//             case actionRequest:
//                 const parties = gData.badges;
//                 if (parties.length == 0) {
//                     return dialogs.alert("Please get a badge first.");
//                 }
//                 // const sigData = Convert.jsonToObject(resultJSON);
//
//                 const msg = c.getSigningData();
//                 const sig = RingSig.SignWithBadge(parties[0], msg.nonce, msg.scope);
//
//                 const fields = {
//                     signature: Convert.byteArrayToHex(sig),
//                     nonce: Convert.byteArrayToHex(msg.nonce)
//                 };
//                 return view.page.showModal("pages/common/qr-code/qr-code-page", {
//                     textToShow: Convert.objectToJson(fields),
//                     title: "Signed informations"
//                 }, () => {
//                 }, true);
//             case actionShare:
//                 return view.showModal("pages/common/qr-code/qr-code-page", {
//                     textToShow: c.getConfigString(),
//                     title: "Coupon information",
//                 }, () => {
//                 }, true);
//             case actionDelete:
//                 return c.remove()
//                     .then(() => {
//                         updateCoupons();
//                     });
//         }
//     }).catch(err => {
//         Log.catch(err);
//         return dialogs.alert("Something went wrong: " + err);
//     })
// }