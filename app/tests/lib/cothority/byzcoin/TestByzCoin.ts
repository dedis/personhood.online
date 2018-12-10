import * as Long from "long";

import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {SpawnerCoin, SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {KeyPair} from "~/lib/KeyPair";

describe("setup byzcoin", () => {
    it("Must create byzcoin", async () => {
        // Creating a new ledger
        Log.print("creating new ledger");
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster);
        Log.print("Getting config");
        await bc.updateConfig();
        Log.print("verifying Interval", bc.config.blockinterval, 1e9);
        expect(bc.config.blockinterval.toNumber()).toBe(1e9);
    })
});

describe("create spawner", () => {
    let originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it("Must create spawner and add some credentials", async () => {
        Log.lvl1("Creating Byzcoin");
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster,
            ["spawn:spawner", "spawn:coin",
                "invoke:mint", "invoke:transfer", "invoke:fetch"]);

        Log.lvl1("Creating genesis-account");
        let genesisIID = new InstanceID(bc.genesisDarc.getBaseId());
        let genesisCoin = await CoinInstance.create(bc, genesisIID, [bc.admin], SpawnerCoin);
        Log.lvl1("Minting some money");
        await genesisCoin.mint([bc.admin],
            Long.fromNumber(1e10));

        Log.lvl1("Creating spawner");
        let spawner = await SpawnerInstance.create(bc, genesisIID,
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
            [bc.admin], user._public, Long.fromNumber(1e6));
        expect(userCoin.coin.value.toNumber()).toBe(1e6);
        await genesisCoin.update();
        expect(genesisCoin.coin.value.toNumber()).toBe(1e10 -
            spawner.spawner.costDarc.value.toNumber() -
            spawner.spawner.costCoin.value.toNumber() - 1e6);
    });
});
