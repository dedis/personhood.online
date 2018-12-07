import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";

fdescribe("setup byzcoin", () => {
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

fdescribe("test", ()=>{
    it("test", ()=>{
        Log.print("one");
        Log.print("one");
    })
});