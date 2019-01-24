import {EventData, fromObject, fromObjectRecursive, Observable} from "tns-core-modules/data/observable";
import {Page} from "tns-core-modules/ui/page";
import {Log} from "~/lib/Log";
import {topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import {msgFailed} from "~/lib/ui/messages";
import {randomBytes} from "crypto-browserify";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";

let page: Page = undefined;

let df: Observable;

let viewModel = fromObject({
    partyList: "",
    dataForm: null,
    networkStatusShow: true,
    networkStatus: "",
});

export function onNavigatingTo(args) {
    Log.lvl1("new poll");
    page = <Page>args.object;

    // Create a map of string to party-name, because the iid cannot be the key of the map.
    let m = new Map();
    gData.badges.forEach(b => m.set(b.party.partyInstance.iid.iid.toString('hex'),
        b.party.partyInstance.popPartyStruct.description.name));
    viewModel.set("partyList", m);

    // Add the object but so we can access it from within this module.
    df = fromObject({
        title: "",
        description: "",
        choices: "",
        party: m.keys().next().value,
    });
    viewModel.set("dataForm", df);
    page.bindingContext = viewModel;
}

export function goBack() {
    return topmost().goBack();
}

export async function save() {
    try {
        let pid = InstanceID.fromHex(df.get("party"));
        let choices = (<string>df.get("choices")).split("\n");
        choices = choices.filter(c => c.trim().length > 0);
        if (choices.length < 2){
            return msgFailed("Please give at least two choices");
        }
        await gData.addPoll(pid, df.get("title"), df.get("description"), choices);
        goBack();
    } catch (e) {
        await msgFailed(e.toString());
        Log.catch(e);
    }
    setProgress();
}

function setProgress(text: string = "", width: number = 0) {
    if (width == 0) {
        viewModel.set("networkStatusShow", false);
    } else {
        viewModel.set("networkStatusShow", true);
        let color = "#308080;";
        if (width < 0) {
            color = "#a04040";
        }
        let pb = topmost().getViewById("progress_bar");
        if (pb) {
            pb.setInlineStyle("width:" + Math.abs(width) + "%; background-color: " + color);
        }
        viewModel.set("networkStatus", text);
    }
}
