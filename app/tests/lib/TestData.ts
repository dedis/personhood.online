import {CreateByzCoin, Data, TestData} from "~/lib/Data";
import {KeyPair} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import * as Long from "long";
import {FileIO} from "~/lib/FileIO";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {User} from "~/lib/User";
import {parseQRCode} from "~/lib/Scan";
import {Buffer} from "buffer";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe("TestData tests", ()=> {
    afterEach(() => {
        Log.print("Buffer print that will be overwritten in case of error");
    });

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
            Log.lvl1(JSON.parse(await FileIO.readFile(fn)));
        })
    });

    describe("saves and loads", () => {
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
                keyIdentity: keyI._private.toHex(),
                keyPersonhood: keyP._private.toHex(),
                bcID: bc.bc.bcID,
                roster: bc.bc.config.roster.toObject(),
            };
            let d = new Data(JSON.stringify(dataObj));
            let d2 = new Data();
            await expect(d2.getValues()).not.toEqual(d.getValues());
            await d2.load();
            await expect(d2.getValues()).not.toEqual(d.getValues());
            await d.save();
            // Avoid automatic initializing of bc
            d2.bc = bc.bc;
            await d2.load();
            d2.bc = null;
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
            Log.lvl1("creating new ledger");
            let bc = await ByzCoinRPC.newLedger(Defaults.Roster);
            Log.lvl1("Getting config");
            await bc.updateConfig();
            Log.lvl1("verifying Interval");
            expect(bc.config.blockinterval.equals(Long.fromNumber(1e9))).toBeTruthy();

            // Setting up organizer1
            let dataOrg1 = new Data({alias: "org1"});
            // Approving organizer1 by sending 10MCoins to the account
            // await bc.mintCoins(dataOrg1.coinInstID, 1e7);
        });
    });

    describe("verify qrcode en/decoding", () => {
        it("show correctly encode", () => {
            let d = new Data();
            d.alias = "org1";
            let str = d.user.qrcodeIdentityStr();
            expect(str.startsWith(User.urlUnregistered)).toBeTruthy();
            let user = parseQRCode(str, 3);
            expect(user.public_ed25519).not.toBeUndefined();
            expect(user.credentials).toBeUndefined();
            expect(user.alias).not.toBeUndefined();

            d.credentialInstance = <any>{iid: new InstanceID(Buffer.alloc(32))};
            str = d.user.qrcodeIdentityStr();
            expect(str.startsWith(User.urlCred)).toBeTruthy();
            user = parseQRCode(str, 3);
            expect(user.public_ed25519).not.toBeUndefined();
            expect(user.credentialIID).not.toBeUndefined();
            expect(user.alias).not.toBeUndefined();
        })
    });

    describe("send and receive coins", () => {
        it("must send coins to store org2", async () => {
            jasmine.getEnv().throwOnExpectationFailure(true);
            // create two organizers, the 1st one being the main organizer, and the 2nd one being
            // one that needs to be signed on.

            Log.lvl1("Creating new testdata for org1");
            let td1 = await TestData.init(new Data());
            await td1.createAll('org1');
            Log.lvl1("public key for cbc:", Buffer.from(td1.cbc.bc.admin.public.marshalBinary()).toString('hex'));
            Log.lvl1("public key for td1:", td1.d.keyIdentity._public.toHex());

            Log.lvl1("Creating org2");
            let d2 = new Data();
            d2.bc = td1.d.bc;
            d2.alias = "org2";
            Log.lvl1("public key for d2:", d2.keyIdentity._public.toHex());
            Log.lvl1("Making sure org2 is not registered yet");
            await d2.verifyRegistration();
            expect(d2.darcInstance).toBeNull();
            expect(d2.coinInstance).toBeNull();
            expect(d2.credentialInstance).toBeNull();

            Log.lvl1("Register org2");
            await td1.d.registerUser(await User.fromQR(td1.cbc.bc, d2.user.qrcodeIdentityStr()), Long.fromNumber(1e6));

            Log.lvl1("Making sure org2 is now registered");
            await d2.verifyRegistration();
            expect(d2.darcInstance).not.toBeNull();
            expect(d2.coinInstance).not.toBeNull();
            expect(d2.credentialInstance).not.toBeNull();

            Log.lvl1("td1 coins before update:", td1.d.coinInstance.coin.value.toNumber());
            await td1.d.coinInstance.update();
            Log.lvl1("td1 coins:", td1.d.coinInstance.coin.value.toNumber());
            await d2.coinInstance.update();
            Log.lvl1("d2 coins:", d2.coinInstance.coin.value.toNumber());
        });
    });
});