import {scan} from "~/lib/Scan";
import {Log} from "~/lib/Log";
import {Data, gData} from "~/lib/Data";
import {User} from "~/lib/User";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as Long from "long";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import {setProgress} from "~/pages/manage/friends/friends-page";

export async function scanNewUser(d: Data): Promise<User> {
    let str = await scan("Scan Identity Code");
    Log.lvl2("Got string scanned:", str);
    let user = await User.fromQR(d.bc, str.text);
    await d.addUser(user);
    await d.save();

    return user;
}

export async function assertRegistered(u: User, setProgress: Function): Promise<boolean> {
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
                await gData.registerUser(u, Long.fromNumber(0), setProgress);
            } catch (e) {
                await msgFailed("Couldn't register user: " + e.toString());
                return false;
            }
            await msgOK(u.alias + " is now registered and can be verified.");
            setProgress();
            return true;
        }
    } else {
        await msgFailed(
            "Cannot register user now, not enough coins", "Registration impossible");
    }
    return false;
}

export async function sendCoins(u: User, setProgress: Function) {
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
                }
            } else {
                await msgFailed("Cannot pay " + coins.toString() + " coins.");
            }
        }
    }
}