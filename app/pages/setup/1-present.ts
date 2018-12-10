/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import {EventData} from "tns-core-modules/data/observable";
import {getFrameById} from "tns-core-modules/ui/frame";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {Log} from "~/lib/Log";
import {CreateByzCoin} from "~/tests/lib/cothority/byzcoin/stdByzcoin";
import {TestStore} from "~/lib/network/TestStorage";
import {Defaults} from "~/lib/Defaults";
import {gData} from "~/lib/Data";

export async function navigatingTo(args: EventData) {
}

export async function goInitTest(args: EventData) {
    try {
        let createBC = "Create ByzCoin";
        switch (await dialogs.action("Please chose initialisation to do",
            "Don't initialize", [createBC])) {
            case createBC:
                Log.lvl1("Creating ByzCoin");
                let bc = await CreateByzCoin.start();
                await TestStore.save(Defaults.Roster, bc.bc.bcID, bc.spawner.iid);
                await gData.setValues({});
                gData.alias = "org1";

                Log.lvl1("Creating user darc")
                gData.darcInstance = await bc.spawner.createDarc(bc.genesisCoin,
                    [bc.bc.admin], gData.keyIdentity._public, "new user");
                gData.coinInstance = await bc.spawner.createCoin(bc.genesisCoin,
                    [bc.bc.admin], gData.darcInstance.darc.getBaseId())

                await gData.save();
                return getFrameById("app-root").navigate("main-page");
        }
    } catch (e){
        Log.rcatch(e);
    }
    return goAlias(args);
}

export function goAlias(args: EventData) {
    return getFrameById("app-root").navigate("pages/setup/2-alias");
}
