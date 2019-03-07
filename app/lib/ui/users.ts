import {scan} from "~/lib/Scan";
import {Log} from "~/lib/Log";
import {Data, gData} from "~/lib/Data";
import {Contact} from "~/lib/Contact";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";
import {msgFailed, msgOK} from "~/lib/ui/messages";

import * as utils from "tns-core-modules/utils/utils";
import {isIOS, isAndroid} from "tns-core-modules/platform";
import * as frame from "tns-core-modules/ui/frame";

export function dismissSoftKeyboard() {
    if (isIOS) {
        frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
        utils.ad.dismissSoftInput();
    }
}

export async function scanNewUser(d: Data): Promise<Contact> {
    let str = await scan("Scan Identity Code");
    Log.lvl2("Got string scanned:", str);
    let user = await Contact.fromQR(d.bc, str.text);
    await d.addContact(user);
    await d.save();

    return user;
}

export async function assertRegistered(u: Contact, setProgress: Function): Promise<boolean> {
    if (u.isRegistered()) {
        return true;
    }
    if (await gData.canPay(gData.spawnerInstance.signupCost)) {
        let pay = await dialogs.confirm({
            title: "Register user",
            message: "This user is not registered yet - do you want to pay " +
                gData.spawnerInstance.signupCost.toString() + " for the registration of " + u.alias + "?",
            okButtonText: "Yes, pay",
            cancelButtonText: "No, don't pay"
        });
        if (pay) {
            try {
                await gData.registerContact(u, Long.fromNumber(0), setProgress);
            } catch (e) {
                await msgFailed("Couldn't register user: " + e.toString());
                return false;
            }
            await u.verifyRegistration(gData.bc);
            await msgOK(u.alias + " is now registered and can be verified.");
            await gData.save();
            return true;
        }
    } else {
        await msgFailed(
            "Cannot register user now, not enough coins", "Registration impossible");
    }
    return false;
}

export async function sendCoins(u: Contact, setProgress: Function) {
    if (await assertRegistered(u, setProgress)) {
        let reply = await dialogs.prompt({
            title: "Send coins",
            message: "How many coins do you want to send to " + u.alias,
            okButtonText: "Send",
            cancelButtonText: "Cancel",
            defaultText: "10000",
        });
        if (reply.result) {
            let coins = Long.fromString(reply.text);
            if (await gData.canPay(coins)) {
                let target = u.getCoinAddress();
                if (target) {
                    setProgress("Transferring coin", 50);
                    await gData.coinInstance.transfer(coins, target, [gData.keyIdentitySigner]);
                    setProgress("Success", 100);
                    await msgOK("Transferred " + coins.toString() + " to " + u.alias)
                    setProgress();
                } else {
                    await msgFailed("couldn't get targetAddress");
                }
            } else {
                await msgFailed("Cannot pay " + coins.toString() + " coins.");
            }
        }
    }
}