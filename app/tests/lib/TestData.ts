import {CreateByzCoin, Data, TestData} from "~/lib/Data";
import {KeyPair, Public} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";
import {Defaults} from "~/lib/Defaults";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import * as Long from "long";
import {FileIO} from "~/lib/FileIO";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Contact} from "~/lib/Contact";
import {parseQRCode} from "~/lib/Scan";
import {PopDesc} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {setupTestData, testData} from "~/tests/lib/TestParty";
import {Party} from "~/lib/Party";
import {
    Attribute,
    Credential,
    CredentialInstance,
    CredentialStruct
} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {PersonhoodRPC} from "~/lib/PersonhoodRPC";
import {RosterSocket} from "~/lib/network/NSNet";

describe("TestData tests", () => {
    afterEach(() => {
        Log.print("Buffer print that will be overwritten in case of error");
    });

    describe("Initializing Data", () => {
        it("Must start with empty values", () => {
            let d = new Data();
            expect(d.contact.alias).toBe("");
            expect(d.contact.email).toBe("");
            expect(d.contact.phone).toBe("");
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
        it("Must keep old data", async () => {
            await FileIO.rmrf(Defaults.DataDir);
            let admin = await TestData.init(new Data());
            let bc = admin.cbc;

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
            let d = new Data(dataObj);
            let d2 = new Data();
            await expect(d2.toObject()).not.toEqual(d.toObject());
            await d2.load();
            await expect(d2.toObject()).not.toEqual(d.toObject());

            await d.save();
            // Avoid automatic initializing of bc
            d2.bc = bc.bc;
            await d2.load();
            d2.bc = null;
            expect(d2.toObject()).toEqual(d.toObject());
            expect(d2.alias).toEqual(dataObj.alias);
            expect(d2.continuousScan).toEqual(dataObj.continuousScan);
        });

        it("Must work with new data", async () => {
            await FileIO.rmrf(Defaults.DataDir);
            let admin = await TestData.init(new Data());
            let bc = admin.cbc;

            let keyI = new KeyPair();
            let keyP = new KeyPair();
            let dataObj = {
                continuousScan: true,
                keyIdentity: keyI._private.toHex(),
                keyPersonhood: keyP._private.toHex(),
                bcID: bc.bc.bcID,
                roster: bc.bc.config.roster.toObject(),
            };
            let d = new Data(dataObj);
            d.contact.alias = "alias";
            d.contact.email = "test@test.com";
            let d2 = new Data();
            await expect(d2.toObject()).not.toEqual(d.toObject());
            await d2.load();
            await expect(d2.toObject()).not.toEqual(d.toObject());
            await d.save();
            // Avoid automatic initializing of bc
            d2.bc = bc.bc;
            await d2.load();
            d2.bc = null;
            expect(d2.toObject()).toEqual(d.toObject());
            expect(d2.alias).toEqual("alias")
            expect(d2.contact.email).toEqual("test@test.com")
        })
    });

    describe("saves/loads parties", async () => {
        it("should load/save party", async () => {
            Log.lvl1("Creates new party with two organizers");
            let td = await setupTestData(1, 1);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");

            await td.orgs[0].publishPersonhood(true);
            let partyInst = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance,
                [td.admin.d.keyIdentitySigner], [td.orgs[0].contact],
                pdesc, Long.fromNumber(1000));
            await partyInst.activateBarrier(td.orgs[0].keyIdentitySigner);

            td.orgs[0].parties.push(new Party(partyInst));
            await td.orgs[0].connectByzcoin();

            let po = td.orgs[0].toObject();
            let dOrg = new Data(po);
            await dOrg.setValues(po);
            await dOrg.connectByzcoin();

            expect(dOrg.toObject()).toEqual(po);
            expect(dOrg.parties.length).toEqual(1);
            expect(dOrg.parties[0].toObject()).toEqual(new Party(partyInst).toObject());
        })
    });

    describe("correctly handles parties and badges", async () => {

        it("should only get appropriate parties with one organizer", async () => {
            let td = await setupTestData(2, 2);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");
            Log.lvl1("*** Creates new party with one or two organizers");
            let ph = new PersonhoodRPC(td.admin.cbc.bc);
            await ph.wipeParties();
            await td.orgs[0].publishPersonhood(true);
            let partyInst = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance,
                [td.admin.d.keyIdentitySigner], [td.orgs[0].contact],
                pdesc, Long.fromNumber(1000));
            await td.orgs[0].addParty(new Party(partyInst));

            Log.lvl1("Verify that all others get pre-barrier party");
            let all = [td.orgs[0], td.atts[0], td.orgs[1], td.atts[1]];
            let others = all.slice(1, 4);
            for (let i = 0; i < others.length; i++) {
                let d = others[i];
                Log.lvl2("Loading parties for", d.alias);
                await d.reloadParties();
                expect(d.parties.length).toBe(1);
                expect(d.parties[0].state).toBe(Party.PreBarrier);
                expect(d.parties[0].isOrganizer).toBeFalsy();
            }

            Log.lvl1("Verify that all others get scanning party");
            await partyInst.activateBarrier(td.orgs[0].keyIdentitySigner);
            expect(td.orgs[0].parties[0].partyInstance.tmpAttendees.length).toBe(1);
            Log.lvl2("finished activating barrier");
            let phrpc = new PersonhoodRPC(td.orgs[0].bc);
            let phParties = await phrpc.listParties();
            expect(phParties.length).toBe(1);
            for (let i = 0; i < others.length; i++) {
                let d = others[i];
                Log.lvl2("Updating parties for", d.alias);
                await d.updateParties();
                expect(d.parties[0].state).toBe(Party.Scanning);
            }

            Log.lvl1("Adding attendee and finalizing party - verifying it gets converted to a badge");
            await td.orgs[0].parties[0].partyInstance.addAttendee(td.atts[0].keyPersonhood._public);
            expect(td.orgs[0].parties[0].partyInstance.tmpAttendees.length).toBe(2);
            await td.orgs[0].parties[0].partyInstance.finalize(td.orgs[0].keyIdentitySigner);
            for (let i = 0; i < all.length; i++) {
                let d = all[i];
                Log.lvl2("Updating parties for", d.alias);
                await d.updateParties();
                expect(d.parties.length).toBe(0);
                if (i < 2) {
                    expect(d.badges.length).toBe(1);
                    expect(d.badges[0].party.state).toBe(Party.Finalized);
                    expect(d.badges[0].mined).toBeFalsy();
                } else {
                    expect(d.badges.length).toBe(0);
                }
            }

            Log.lvl1("Mining badge for org1");
            let d = td.orgs[0];
            let before = d.coinInstance.coin.value;
            await d.badges[0].mine(d);
            await d.coinInstance.update();
            expect(d.coinInstance.coin.value.sub(before).toNumber()).toBe(1000);
            Log.lvl1("Mining badge for att1");
            d = td.atts[0];
            await d.badges[0].mine(d);
            await d.coinInstance.update();
            expect(d.coinInstance.coin.value.toNumber()).toBe(900);
            expect(d.contact.isRegistered()).toBeTruthy();

            Log.lvl1("Mining again");
            let miners = [td.orgs[0], td.atts[0]];
            for (let i = 0; i < miners.length; i++) {
                let d = miners[i];
                Log.lvl2("Mining again", d.alias);
                expect(d.badges[0].mined).toBeTruthy();
                let before = d.coinInstance.coin.value;
                await expectAsync(d.badges[0].mine(d)).toBeRejected();
                await d.coinInstance.update();
                expect(d.coinInstance.coin.value.sub(before).toNumber()).toBe(0);
            }
        })
    });

    describe("verify qrcode en/decoding", () => {
        it("show correctly encode", () => {
            let d = new Data();
            d.contact.alias = "org1";
            let str = d.contact.qrcodeIdentityStr();
            expect(str.startsWith(Contact.urlUnregistered)).toBeTruthy();
            let user = parseQRCode(str, 3);
            expect(user.public_ed25519).not.toBeUndefined();
            expect(user.credentials).toBeUndefined();
            expect(user.alias).not.toBeUndefined();

            d.contact.credentialInstance = new CredentialInstance(null, new InstanceID(Buffer.alloc(32)),
                new CredentialStruct([]));
            d.contact.credentialInstance.credential.credentials.push(new Credential("public",
                [new Attribute("ed25519", Public.fromRand().toBuffer())]));
            str = d.contact.qrcodeIdentityStr();
            expect(str.startsWith(Contact.urlRegistered)).toBeTruthy();
            user = parseQRCode(str, 3);
            expect(user.public_ed25519).not.toBeUndefined();
            expect(user.credentialIID).not.toBeUndefined();
            expect(user.alias).not.toBeUndefined();
        })
    });

    describe("send and receive coins", () => {
        it("must send coins to store org2", async () => {
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
            d2.contact.alias = "org2";
            Log.lvl1("public key for d2:", d2.keyIdentity._public.toHex());
            Log.lvl1("Making sure org2 is not registered yet");
            await d2.verifyRegistration();
            expect(d2.darcInstance).toBeNull();
            expect(d2.coinInstance).toBeNull();
            expect(d2.credentialInstance).toBeNull();

            Log.lvl1("Register org2");
            await td1.d.registerContact(await Contact.fromQR(td1.cbc.bc, d2.contact.qrcodeIdentityStr()), Long.fromNumber(1e6));

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
})
;