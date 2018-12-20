/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {getFrameById, topmost} from "tns-core-modules/ui/frame";
import {gData} from "~/lib/Data";
import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {TestStore} from "~/lib/network/TestStorage";
import {navigatingToHome, switchHome} from "~/pages/home/home-page";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from "application";
import {SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import {switchSettings} from "~/pages/settings/settings-page";
import {switchLab} from "~/pages/lab/lab-page";
import {switchManage} from "~/pages/manage/manage-page";
import {msgFailed} from "~/lib/ui/messages";
declare const exit: (code: number)=>void;

// Verify if we already have data or not. If it's a new installation, present the project
// and ask for an alias, and set up keys.
export async function navigatingTo(args: EventData) {
    try {
        if (Defaults.Testing) {
                let ts = await TestStore.load(Defaults.Roster);
                Defaults.ByzCoinID = ts.bcID;
                Defaults.SpawnerIID = ts.spawnerIID;
        }
        await gData.load();
        Log.lvl1("Loaded", gData.alias);
        if (gData.alias == "") {
            return getFrameById("app-root").navigate("pages/setup/1-present");
        } else if (!gData.darcInstance) {
            return getFrameById("app-root").navigate("pages/setup/3-activate");
        }
        await navigatingToHome(args);
    } catch (e) {
        Log.catch(e);
        await msgFailed("Error when setting up communication: " + e.toString());
        let again = await dialogs.confirm({
            title: "Network error",
            message: "Do you want to try again?",
            okButtonText: "Try again",
            cancelButtonText: "Quit",
        });
        if (again){
            await navigatingTo(args);
        } else {
            if (application.android){
                application.android.foregroundActivity.finish();
            } else {
                exit(0);
            }
        }
    }
}

export async function onChangeTab(args: SelectedIndexChangedEventData){
    switch (args.newIndex){
        case 0:
            await switchHome(args);
            break;
        case 1:
            await switchManage(args);
            break;
        case 2:
            await switchLab(args);
            break;
        case 3:
            await switchSettings(args);
            break;
    }
}
