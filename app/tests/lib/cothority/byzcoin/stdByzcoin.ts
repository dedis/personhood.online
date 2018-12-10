import {Log} from "~/lib/Log";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Defaults} from "~/lib/Defaults";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {SpawnerCoin, SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import * as Long from "long";
import {KeyPair} from "~/lib/KeyPair";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";

export class CreateByzCoin {
    constructor(public bc: ByzCoinRPC = null, public spawner: SpawnerInstance = null,
                public genesisIID: InstanceID = null, public genesisCoin: CoinInstance = null) {
    }

    async addUser(alias: string, balance: Long = Long.fromNumber(0)): Promise<cbcUser>{
        Log.lvl1("Creating user with spawner");
        Log.lvl1("Spawning darc");
        let user = new KeyPair();
        let userDarc = await this.spawner.createDarc(this.genesisCoin,
            [this.bc.admin], user._public, "new user");

        Log.lvl1("Spawning coin");
        let userCoin = await this.spawner.createCoin(this.genesisCoin,
            [this.bc.admin], userDarc.darc.getBaseId(), Long.fromNumber(1e6));
        return new cbcUser(userDarc, userCoin);
    }

    static async start() : Promise<CreateByzCoin>{
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
        return new CreateByzCoin(bc, spawner, genesisIID, genesisCoin);
    }
}

export class cbcUser{
    constructor(public darcInst: DarcInstance, public coinInst: CoinInstance){}
}