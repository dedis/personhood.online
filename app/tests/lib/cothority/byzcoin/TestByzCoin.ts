import * as Long from "long";

import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {SpawnerCoin, SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {KeyPair} from "~/lib/KeyPair";
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe("setup byzcoin", () => {
    it("Must create byzcoin", async () => {
        // Creating a new ledger
        Log.lvl1("creating new ledger");
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster);
        Log.lvl1("Getting config");
        await bc.updateConfig();
        Log.lvl1("verifying Interval", bc.config.blockinterval, 1e9);
        expect(bc.config.blockinterval.equals(1e9)).toBeTruthy();
    })
});

describe("create spawner", () => {
    it("Must create spawner and add some credentials", async () => {
        Log.lvl1("Creating Byzcoin");
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster,
            ["spawn:spawner", "spawn:coin",
                "invoke:mint", "invoke:transfer", "invoke:fetch"]);

        Log.lvl1("Creating genesis-account");
        let genesisDarcIID = new InstanceID(bc.genesisDarc.getBaseId());
        let genesisCoin = await CoinInstance.create(bc, genesisDarcIID, [bc.admin], SpawnerCoin);
        Log.lvl1("Minting some money");
        await genesisCoin.mint([bc.admin],
            Long.fromNumber(1e10));

        Log.lvl1("Creating spawner");
        let spawner = await SpawnerInstance.create(bc, genesisDarcIID,
            [bc.admin],
            Long.fromNumber(100), Long.fromNumber(100),
            Long.fromNumber(100), Long.fromNumber(1e7),
            genesisCoin.iid);

        Log.lvl1("Creating user with spawner");
        Log.lvl1("Spawning darc");
        let user = new KeyPair();
        let userDarc = await spawner.createDarc(genesisCoin,
            [bc.admin], user._public, "new user");

        Log.lvl1("Spawning coin");
        let userCoin = await spawner.createCoin(genesisCoin,
            [bc.admin], userDarc.iid.iid, Long.fromNumber(1e6));

        Log.lvl1("Checking correct numbers");
        expect(userCoin.coin.value.equals(Long.fromNumber(1e6))).toBeTruthy();
        await genesisCoin.update();
        expect(genesisCoin.coin.value.toNumber()).toBe(1e10 -
            spawner.spawner.costDarc.value.toNumber() -
            spawner.spawner.costCoin.value.toNumber() - 1e6);
    });
});
