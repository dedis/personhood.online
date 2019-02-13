/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData, fromObject, Observable} from "tns-core-modules/data/observable";
import {getFrameById, getViewById, Page, topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {TestStore} from "~/lib/network/TestStore";
import {navigatingToHome, switchHome} from "~/pages/home/home-page";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from "application";
import {SelectedIndexChangedEventData, TabView} from "tns-core-modules/ui/tab-view";
import {adminView, switchSettings} from "~/pages/settings/settings-page";
import {switchLab} from "~/pages/lab/lab-page";
import {switchIdentity} from "~/pages/identity/identity-page";
import {msgFailed} from "~/lib/ui/messages";
import {AdminViewModel} from "~/pages/settings/settings-view";
import {ad} from "tns-core-modules/utils/utils";
import getId = ad.resources.getId;
import {FileIO} from "~/lib/FileIO";

declare const exit: (code: number) => void;

export let mainView = fromObject({showGroup: 0});

// Verify if we already have data or not. If it's a new installation, present the project
// and ask for an alias, and set up keys.
export async function navigatingTo(args: EventData) {
    try {
        Log.lvl2("navigatingTo: main-page");
        let page = <Page>args.object;
        page.bindingContext = mainView;

        if (gData.bc){
            return mainViewRegistered(args);
        }

        if (Defaults.LoadTestStore) {
            let ts = await TestStore.load(Defaults.Roster);
            Defaults.ByzCoinID = ts.bcID;
            Defaults.SpawnerIID = ts.spawnerIID.iid;
        }
        if (Defaults.DataFile) {
            await FileIO.writeFile(Defaults.DataDir + "/data.json", Defaults.DataFile);
        }
        Log.lvl1("loading");
        await gData.load();
        if (!gData.contact.alias || gData.contact.alias == "") {
            return mainViewRegister(args);
        }
        return mainViewRegistered(args);
    } catch (e) {
        Log.catch(e);
        await msgFailed("Error when setting up communication: " + e.toString());
        let again = await dialogs.confirm({
            title: "Network error",
            message: "Do you want to try again?",
            okButtonText: "Try again",
            cancelButtonText: "Quit",
        });
        if (again) {
            await navigatingTo(args);
        } else {
            if (application.android) {
                application.android.foregroundActivity.finish();
            } else {
                exit(0);
            }
        }
    }
}

export function mainViewRegistered(args: any) {
    Log.lvl1("mainViewRegistered");
    mainView.set("showGroup", 2);
    let tv = <TabView>getFrameById("app-root").getViewById("mainTabView");
    tv.selectedIndex = 0;
    return switchHome(args);
}

export function mainViewRegister(args: any) {
    Log.lvl1("mainViewRegister");
    mainView.set("showGroup", 1);
    return getFrameById("setup").navigate("pages/setup/1-present");
}

export async function onChangeTab(args: SelectedIndexChangedEventData) {
    Log.lvl2("onchangetab", args.newIndex);
    switch (args.newIndex) {
        case 0:
            await switchHome(args);
            break;
        case 1:
            await switchIdentity(args);
            break;
        case 2:
            await switchLab(args);
            break;
        case 3:
            await switchSettings(args);
            break;
    }
}
