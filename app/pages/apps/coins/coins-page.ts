// import {NavigatedData, Page} from "ui/page";
// import {CoinsViewModel} from "./coins-view-model";
// import * as Dialog from "tns-core-modules/ui/dialogs";
// import {topmost} from "tns-core-modules/ui/frame";
//
// import {Buffer} from "buffer/";
//
// const PlatformModule = require("tns-core-modules/platform");
// const ZXing = require("nativescript-zxing");
// const ImageSource = require("image-source");
// const QRGenerator = new ZXing();
//
// let lib = require("../../../lib");
// let Scan = lib.Scan;
// import Log from "~/lib/Log";
// import * as Badge from "~/lib/pop/Badge";
// import {Label} from "tns-core-modules/ui/label";
// import {gData} from "~/app";
//
// let Convert = lib.Convert;
//
// let page: Page = undefined;
// let party: Badge.Badge = undefined;
//
// export function onNavigatingTo(args: NavigatedData) {
//     Log.lvl1("getting to badges");
//     page = <Page>args.object;
//     page.bindingContext = CoinsViewModel;
//     return showParties(Promise.resolve(gData.badges))
//         .then(() => {
//             setTimeout(() => {
//                 showParties(gData.updateAllBadges());
//             }, 100);
//         });
// }
//
// function setProgress(text: string = "", width: number = 0) {
//     if (width == 0) {
//         CoinsViewModel.set("networkStatus", undefined);
//     } else {
//         page.getViewById("progress_bar").setInlineStyle("width:" + width + "%;");
//         (<Label>page.getViewById("progress_text")).text = text;
//     }
// }
//
// function showParties(badges: Promise<Array<Badge.Badge>>) {
//     Log.lvl1("Showing parties");
//     return badges.then(badges => {
//         party = undefined;
//         page.bindingContext.qrcode = undefined;
//         badges.forEach((b: Badge.Badge) => {
//             if (party != undefined){
//                 // Only take first badge into account
//                 return;
//             }
//             if (b.state() == Badge.STATE_TOKEN) {
//                 party = b;
//                 page.bindingContext.balance = b.balance;
//                 let pubBase64 = Buffer.from(b.keypair.public.marshalBinary()).toString('base64');
//                 let text = " { \"public\" :  \"" + pubBase64 + "\"}";
//                 let sideLength = PlatformModule.screen.mainScreen.widthPixels / 4;
//                 const qrcode = QRGenerator.createBarcode({
//                     encode: text,
//                     format: ZXing.QR_CODE,
//                     height: sideLength,
//                     width: sideLength
//                 });
//                 page.bindingContext.qrcode = ImageSource.fromNativeSource(qrcode);
//                 // Take first badge that is in STATE_TOKEN
//                 return;
//             }
//         });
//     }).catch(err => {
//         Log.catch(err);
//     });
// }
//
// export function sendCoins(args) {
//     let amount = undefined;
//
//     return Dialog.prompt({
//         title: "Amount",
//         message: "Please choose the amount of PoP-Coin you want to transfer",
//         okButtonText: "Transfer",
//         cancelButtonText: "Cancel",
//         defaultText: "50000",
//     }).then((r) => {
//         if (!r.result) {
//             throw new Error("Cancelled");
//         }
//         amount = Number(r.text);
//         if (isNaN(amount) || !(Number.isInteger(amount)) || amount <= 0) {
//             return Dialog.alert({
//                 title: "Wrong input",
//                 message: "You can only enter an integer number > 0. Please try again.",
//                 okButtonText: "Ok"
//             }).then(() => {
//                 throw new Error("wrong input");
//             });
//         }
//         return Scan.scan()
//             .catch(err => {
//                 Log.rcatch(err);
//             })
//             .then(publicKeyJson => {
//                 const publicKeyObject = Convert.jsonToObject(publicKeyJson);
//                 setProgress("Transferring coin", 20);
//                 return party.transferCoin(amount, Convert.base64ToByteArray(publicKeyObject.public), true)
//                     .then(() => {
//                         setProgress("Updating coins", 100);
//                         return updateCoins();
//                     })
//                     .then(() => {
//                         setProgress();
//                         return Dialog.alert({
//                             title: "Success",
//                             message: "" + amount + " PoP-Coins have been transferred",
//                             okButtonText: "Ok"
//                         });
//                     })
//                     .catch((err) => {
//                         setProgress();
//                         return Dialog.alert({
//                             title: "Network Error",
//                             message: "Couldn't update coins: " + err,
//                             okButtonText: "Ok"
//                         }).then(() => {
//                             Log.rcatch(err);
//                         });
//                     });
//             });
//     });
// }
//
// function updateCoins() {
//     setProgress("Updating coins", 50);
//     return showParties(gData.updateAllBadges())
//         .then(() => {
//             setProgress();
//         })
//         .catch(() => {
//             setProgress();
//         });
// }
//
// export function onBack() {
//     topmost().goBack();
// }
//
// export function onReload() {
//     return updateCoins();
// }
//
// export function cancelNetwork() {
//     setProgress();
// }
