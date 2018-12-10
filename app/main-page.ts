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

// Verify if we already have data or not. If it's a new installation, present the project
// and ask for an alias, and set up keys.
export async function navigatingTo(args: EventData) {
    try {
        if (Defaults.Testing) {
            try {
                let ts = await TestStore.load(Defaults.Roster);
                Defaults.ByzCoinID = ts.bcID;
                Defaults.SpawnerIID = ts.spawnerIID;
            } catch(e){
                Log.catch(e);
            }
        }
        await gData.load();
        Log.print("Loaded", gData.alias);
        if (gData.alias == "") {
            return getFrameById("app-root").navigate("pages/setup/1-present");
            // return topmost().navigate("pages/setup/1-present");
        } else if (!gData.darcInstance) {
            return getFrameById("app-root").navigate("pages/setup/3-activate");
        }
    } catch (e) {
        Log.catch(e);
    }
}
