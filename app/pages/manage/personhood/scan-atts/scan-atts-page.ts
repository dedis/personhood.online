import {ScanAttsView} from "~/pages/manage/personhood/scan-atts/scan-atts-view";

import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {gData} from "~/lib/Data";
import {Party} from "~/lib/Party";
import {parseQRCode, scan} from "~/lib/Scan";
import {msgFailed, msgOK} from "~/lib/ui/messages";
import {topmost} from "tns-core-modules/ui/frame";

let viewModel: ScanAttsView;
let party: Party = undefined;

export async function onLoaded(args) {
    const page = <Page>args.object;
    party = page.navigationContext;
    viewModel = new ScanAttsView(party);
    page.bindingContext = viewModel;
}

export async function addNewKey() {
    try {
        let keys = viewModel.size;
        while (true) {
            await addScan();
            if (!gData.continuousScan) {
                if (!await dialogs.confirm({
                    title: "Scanning",
                    message: "Do you want to scan another attendee?",
                    okButtonText: "Scan Next",
                    cancelButtonText: "Stop scanning",
                })) {
                    return;
                }
            } else {
                if (keys != viewModel.size) {
                    keys++;
                } else {
                    return;
                }
            }
        }
    } catch (e) {
        await msgFailed("Something went wrong: " + e.toString());
    }
}

/**
 * Function called when the button "finalize" is clicked. It starts the registration process with the organizers conode.
 * @returns {Promise.<any>}
 */
export async function finalize() {
    try {
        await party.partyInstance.finalize(gData.keyIdentitySigner);
        if (party.partyInstance.popPartyStruct.state == Party.Finalized) {
            await msgOK("Finalized the party");
            await gData.save();
        } else {
            await msgOK("Waiting for other organizers to finalize");
        }
        await goBack();
    } catch (e) {
        await msgFailed("Something went wrong: " + e.toString());
    }
}

export async function goBack() {
    return topmost().goBack();
}

async function addScan() {
    try {
        let result = await scan("Please scan attendee");
        let qrcode = parseQRCode(result.text, 2);
        if (qrcode.url == Party.url) {
            if (qrcode.public.length == 64) {
                viewModel.addAttendee(qrcode.public);
            } else {
                await msgFailed("Got wrong public key");
            }
        } else {
            await msgFailed("This is not a party");
        }
    } catch (e) {
        await addManual();
    }
}

async function addManual() {
    let args = await dialogs.prompt({
        title: "Public Key",
        message: "Please enter the public key of an attendee.",
        okButtonText: "Register",
        cancelButtonText: "Cancel",
        inputType: dialogs.inputType.text
    });
    if (args.result && args.text !== undefined && args.text.length == 64) {
        viewModel.addAttendee(args.text);
    }
}

