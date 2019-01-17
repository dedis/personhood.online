/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObjectRecursive, Observable} from "tns-core-modules/data/observable";
import {getFrameById, Page} from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Log} from "~/lib/Log";
import {TestStore} from "~/lib/network/TestStore";
import {Defaults} from "~/lib/Defaults";
import {gData, TestData} from "~/lib/Data";
import {Label} from "tns-core-modules/ui/label";
import {mainView} from "~/main-page";
import {openUrl} from "tns-core-modules/utils/utils";

let view: Observable = fromObjectRecursive({
    networkStatus: undefined
});
let page: Page;

export async function navigatingTo(args: EventData) {
    Log.lvl2("navigatingTo: 1-present");
    page = <Page>args.object;
    page.bindingContext = view;
    setProgress();
    return gData.connectByzcoin();
}

export async function goInitTest(args: EventData) {
    try {
        let createBC = "Create ByzCoin";
        switch (await dialogs.action("Please chose initialisation to do",
            "Don't initialize", [createBC])) {
            case createBC:
                setProgress("creating ByzCoin", 20);
                let td = await TestData.init(gData);

                setProgress("creating darc", 40);
                await td.createUserDarc('org1');

                setProgress("creating credentials", 60);
                await td.createUserCoin();

                setProgress("creating credentials", 80);
                await td.createUserCredentials();

                setProgress("saving", 100);
                await gData.save();
                mainView.set("showGroup", 2);
        }
    } catch (e) {
        Log.rcatch(e);
    }
    return goAlias(args);
}

export async function goReloadBC(args: EventData) {
    try {
        let ts = await TestStore.load(Defaults.Roster);
        Defaults.ByzCoinID = ts.bcID;
        Defaults.SpawnerIID = ts.spawnerIID;
        gData.delete();
        await gData.connectByzcoin();
    } catch (e) {
        Log.rcatch(e);
    }
    return goAlias(args);
}

export function goAlias(args: EventData) {
    return getFrameById("setup").navigate("pages/setup/2-alias");
}

export function goPersonhood(){
    openUrl("https://personhood.online");
}

function setProgress(text: string = "", width: number = 0) {
    if (width == 0) {
        view.set("networkStatus", undefined);
    } else {
        let pb = page.getViewById("progress_bar");
        if (pb) {
            pb.setInlineStyle("width:" + width + "%;");
            (<Label>page.getViewById("progress_text")).text = text;
        }
    }
}
