import {Data, TestData} from "~/lib/Data";
import {KeyPair} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {CreateByzCoin} from "~/tests/lib/cothority/byzcoin/stdByzcoin";
import * as Long from "long";
import {FileIO} from "~/lib/FileIO";

describe("Initializing Data", () => {
    it("Must start with empty values", () => {
        let d = new Data();
        expect(d.alias).toBe("");
        expect(d.email).toBe("");
        expect(d.continuousScan).toBe(false);
        expect(d.keyIdentity).not.toBe(null);
        expect(d.keyPersonhood).not.toBe(null);
    });
});

describe("load/save", () => {
    it("must save", async () => {
        let fn = "test.json";
        let obj = {
            buf: Buffer.from([1, 2, 3]),
        };
        await FileIO.writeFile(fn, JSON.stringify(obj));
        Log.print(JSON.parse(await FileIO.readFile(fn)));
        Log.print();
    })
});

describe("saves and loads", () => {
    let originalTimeout;

    beforeEach(async function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it("Must keep data", async () => {
        await FileIO.rmrf(Defaults.DataDir);
        // jasmine.getEnv().throwOnExpectationFailure(true);
        Defaults.Testing = true;
        let bc = await CreateByzCoin.start();

        let keyI = new KeyPair();
        let keyP = new KeyPair();
        let dataObj = {
            alias: "alias",
            email: "email@email.com",
            continuousScan: true,
            keyIdentity: keyI._private.marshalBinary(),
            keyPersonhood: keyP._private.marshalBinary(),
            bcID: bc.bc.bcID,
            roster: bc.bc.config.roster.toObject(),
        };
        let d = new Data(JSON.stringify(dataObj));
        let d2 = new Data();
        await expect(d2.getValues()).not.toEqual(d.getValues());
        await d2.load();
        await expect(d2.getValues()).not.toEqual(d.getValues());
        await d.save();
        await d2.load();
        expect(d2.getValues()).toEqual(d.getValues());

        let cbc = await CreateByzCoin.start();
        let org1 = await cbc.addUser("org1");
        d.bc = cbc.bc;
        d.darcInstance = org1.darcInst;
        d.coinInstance = org1.coinInst;
        await d.save();
        d2 = new Data();
        await d2.load();
        await d2.connectByzcoin();
        expect(JSON.stringify(d2.getValues())).toEqual(JSON.stringify(d.getValues()));
        expect(d2.darcInstance.iid).toEqual(d.darcInstance.iid);
        expect(d2.coinInstance.iid).toEqual(d.coinInstance.iid);
    })
});

xdescribe("connects to local byzcoin", () => {
    it("Must ping byzcoin", async () => {
        let d = new Data({});
        let bc = await d.connectByzcoin();
    })
});

describe("setup byzcoin and create party", () => {
    it("Must create byzcoin", async () => {
        // Creating a new ledger
        Log.print("creating new ledger");
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster);
        Log.print("Getting config");
        await bc.updateConfig();
        Log.print("verifying Interval");
        expect(bc.config.blockinterval).toBe(Long.fromNumber(1e9));

        // Setting up organizer1
        let dataOrg1 = new Data({alias: "org1"});
        // Approving organizer1 by sending 10MCoins to the account
        // await bc.mintCoins(dataOrg1.coinInstID, 1e7);
    });
});

fdescribe("send and receive coins", () => {
    it("must send coins to store org2", async () => {
        // create two organizers, the 1st one being the main organizer, and the 2nd one being
        // one that needs to be signed on.

        let td1 = await TestData.init(new Data());
        await td1.createAll('org1');
        let d2 = new Data();
        await d2.verifyRegistration();
        expect(d2.darcInstance).toBeNull();
        expect(d2.coinInstance).toBeNull();
        expect(d2.credentialInstance).toBeNull();

        await expectAsync(td1.d.registerUser(td1.d.qrcodeIdentityStr())).toBeRejected();
        await expectAsync(td1.d.registerUser(d2.qrcodeIdentityStr())).toBeResolved();
        await d2.verifyRegistration();
        expect(d2.darcInstance).not.toBeNull();
        expect(d2.coinInstance).not.toBeNull();
        expect(d2.credentialInstance).not.toBeNull();

        Log.print("td1 coins before update:", td1.d.coinInstance.coin.value.toNumber())
        await td1.d.coinInstance.update();
        Log.print("td1 coins:", td1.d.coinInstance.coin.value.toNumber())
        await d2.coinInstance.update();
        Log.print("d2 coins:", d2.coinInstance.coin.value.toNumber())
    });
});