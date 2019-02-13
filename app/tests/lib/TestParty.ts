import {Log} from "~/lib/Log";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Defaults} from "~/lib/Defaults";
import * as Long from "long";
import {Data, TestData} from "~/lib/Data";
import {Contact} from "~/lib/Contact";
import {PopDesc, PopPartyInstance, PopPartyStruct} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {KeyPair} from "~/lib/KeyPair";
import {Party} from "~/lib/Party";
import {Badge} from "~/lib/Badge";

describe("TestParty tests", () => {
    describe("testing basic functionalities", () => {
        it("must correctly save attendees", async () => {
            Log.lvl1("*** must correctly save attendees");
            let ppi = new PopPartyInstance(null, null);
            ppi.popPartyStruct = new PopPartyStruct(1, 0, [], null, null, [], Long.fromNumber(0), null, null);
            let att1 = new KeyPair();
            let att2 = new KeyPair();

            await expectAsync(ppi.addAttendee(att1._public)).toBeRejected();
            ppi.popPartyStruct.state = Party.Scanning;

            expect(ppi.tmpAttendees.length).toBe(0);
            await ppi.addAttendee(att1._public);
            expect(ppi.tmpAttendees.length).toBe(1);
            await ppi.addAttendee(att2._public);
            expect(ppi.tmpAttendees.length).toBe(2);
            await expectAsync(ppi.addAttendee(att1._public)).toBeRejected();
            expect(ppi.tmpAttendees.length).toBe(2);
            await expectAsync(ppi.addAttendee(att2._public)).toBeRejected();
            expect(ppi.tmpAttendees.length).toBe(2);

            await ppi.delAttendee(att1._public);
            expect(ppi.tmpAttendees.length).toBe(1);
            await expectAsync(ppi.delAttendee(att1._public)).toBeRejected();
            expect(ppi.tmpAttendees.length).toBe(1);
            await ppi.delAttendee(att2._public);
            expect(ppi.tmpAttendees.length).toBe(0);
            await expectAsync(ppi.delAttendee(att2._public)).toBeRejected();
            expect(ppi.tmpAttendees.length).toBe(0);

            ppi.popPartyStruct.state = Party.Finalized;
            await expectAsync(ppi.addAttendee(att1._public)).toBeRejected();
        })
    });

    describe("setup byzcoin and create party", () => {
        afterEach(() => {
            Log.print("Buffer print that will be overwritten in case of error");
        });

        it("Creates new party", async () => {
            Log.lvl1("*** Creates new party");
            let td = await setupTestData(1, 2);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");

            await td.orgs[0].publishPersonhood(true);
            let partyInst = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], [td.orgs[0].contact], pdesc, Long.fromNumber(1000));
            Log.lvl1("finished creating byzcoin, organizer and attendee");

            // Cannot get final statement yet.
            await expectAsync(partyInst.getFinalStatement()).toBeRejected();

            Log.lvl1("setting barrier");
            await partyInst.activateBarrier(td.orgs[0].keyIdentitySigner);

            Log.lvl1("Adding attendee");
            await partyInst.addAttendee(td.atts[0].keyPersonhood._public);
            expect(partyInst.tmpAttendees.length).toBe(1);

            // Finalizing party
            Log.lvl1("Finalize party");
            await partyInst.finalize(td.orgs[0].keyIdentitySigner);
            expect(partyInst.popPartyStruct.state).toBe(Party.Finalized);

            // Cannot set barrier anymore
            Log.lvl1("Resetting barrier");
            await expectAsync(partyInst.activateBarrier(td.orgs[0].keyIdentitySigner)).toBeRejected();

            let fs = await partyInst.getFinalStatement();
            expect(fs.attendees.keys.length).toBe(1);

            await partyInst.mineFromData(td.atts[0]);
            expect(td.atts[0].coinInstance.coin.value.toNumber()).toBe(1000);

            Log.lvl1("expect unknown attendee to be rejected");
            partyInst.popPartyStruct.attendees.keys = [td.atts[0].keyPersonhood._public, td.atts[1].keyPersonhood._public];
            await expectAsync(partyInst.mineFromData(td.atts[1])).toBeRejected();
            Log.lvl1("expecting double-mining to be rejected");
            partyInst.popPartyStruct.attendees.keys = [td.atts[0].keyPersonhood._public];
            await expectAsync(partyInst.mineFromData(td.atts[0])).toBeRejected();
        });

        it("Should set barrier with all organizers", async () => {
            Log.lvl1("*** Should set barrier with all organizers");
            let td = await setupTestData(2, 2);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");
            let orgs = td.orgs.map(o => o.contact);
            await td.orgs[0].publishPersonhood(true);
            await td.orgs[1].publishPersonhood(true);

            let partyInstance = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], orgs, pdesc, Long.fromNumber(1000));
            Log.lvl1("setting barrier for org0");
            await partyInstance.activateBarrier(td.orgs[0].keyIdentitySigner);

            // Need different name here so it will create another darc
            pdesc.name = "test2";
            partyInstance = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], orgs, pdesc, Long.fromNumber(1000));
            Log.lvl1("setting barrier for org1");
            await partyInstance.activateBarrier(td.orgs[1].keyIdentitySigner);
        });

        it("Creates new party with two organizers", async () => {
            Log.lvl1("*** Creates new party with two organizers");
            let td = await setupTestData(2, 3);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");
            let orgs = td.orgs.map(o => o.contact);
            await td.orgs[0].publishPersonhood(true);
            await td.orgs[1].publishPersonhood(true);

            let partyInst0 = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], orgs, pdesc, Long.fromNumber(1000));
            Log.lvl1("setting barrier for org0");
            await partyInst0.activateBarrier(td.orgs[0].keyIdentitySigner);

            // Need different name here so it will create another darc
            pdesc.name = "test2";
            partyInst0 = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], orgs, pdesc, Long.fromNumber(1000));
            Log.lvl1("setting barrier for org1");
            await partyInst0.activateBarrier(td.orgs[1].keyIdentitySigner);
            let partyInst1 = await PopPartyInstance.fromByzcoin(td.admin.cbc.bc, partyInst0.iid);

            Log.lvl1("Checking verification of all attendees");
            await partyInst0.addAttendee(td.atts[0].keyPersonhood._public);
            await partyInst0.addAttendee(td.atts[1].keyPersonhood._public);
            await partyInst1.addAttendee(td.atts[0].keyPersonhood._public);

            // Finalizing party
            Log.lvl1("Finalize party - this will fail");
            await partyInst0.finalize(td.orgs[0].keyIdentitySigner);
            expect(partyInst0.popPartyStruct.state).toBe(Party.Scanning);
            await partyInst1.finalize(td.orgs[1].keyIdentitySigner);
            expect(partyInst1.popPartyStruct.state).toBe(Party.Scanning);
            // Remove this attendee to make sure it doesn't finalize
            await partyInst0.delAttendee(td.atts[0].keyPersonhood._public);
            await partyInst0.finalize(td.orgs[0].keyIdentitySigner);
            expect(partyInst0.popPartyStruct.state).toBe(Party.Scanning);

            Log.lvl1("Adding attendees in different order");
            await partyInst0.addAttendee(td.atts[0].keyPersonhood._public);
            await partyInst1.addAttendee(td.atts[1].keyPersonhood._public);

            // Finalizing party
            Log.lvl1("Finalize party");
            await partyInst0.finalize(td.orgs[0].keyIdentitySigner);
            expect(partyInst0.popPartyStruct.state).toBe(Party.Scanning);
            await partyInst1.finalize(td.orgs[1].keyIdentitySigner);
            expect(partyInst1.popPartyStruct.state).toBe(Party.Finalized);
            await partyInst0.update();
            expect(partyInst0.popPartyStruct.state).toBe(Party.Finalized);

            let fs = await partyInst0.getFinalStatement();
            expect(fs.attendees.keys.length).toBe(2);

            await partyInst0.mineFromData(td.atts[0]);
            expect(td.atts[0].coinInstance.coin.value.toNumber()).toBe(1000);

            Log.lvl1("expect unknown attendee to be rejected");
            partyInst0.popPartyStruct.attendees.keys = [td.atts[0].keyPersonhood._public, td.atts[1].keyPersonhood._public];
            await expectAsync(partyInst0.mineFromData(td.atts[2])).toBeRejected();
            Log.lvl1("expecting double-mining to be rejected");
            partyInst0.popPartyStruct.attendees.keys = [td.atts[0].keyPersonhood._public];
            await expectAsync(partyInst0.mineFromData(td.atts[0])).toBeRejected();
        });

        it("Saves and loads parties and badges", async () => {
            Log.lvl1("*** Saves and loads parties and badges");
            let td = await setupTestData(2, 2);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");
            let orgs = td.orgs.map(o => o.contact);
            await td.orgs[0].publishPersonhood(true);
            await td.orgs[1].publishPersonhood(true);

            let partyInst = await td.admin.cbc.spawner.createPopParty(td.admin.d.coinInstance, [td.admin.d.keyIdentitySigner], orgs, pdesc, Long.fromNumber(1000));
            let party = new Party(partyInst);
            let badge = new Badge(party, td.atts[0].keyPersonhood);

            let partyObj = party.toObject();
            let badgeObj = badge.toObject();

            let party2 = Party.fromObject(td.admin.cbc.bc, partyObj);
            let badge2 = Badge.fromObject(td.admin.cbc.bc, badgeObj);

            expect(partyObj).toEqual(party2.toObject());
            expect(badgeObj).toEqual(badge2.toObject());
        });
    });
});

export class testData {
    constructor(public admin: TestData, public orgs: Data[], public atts: Data[]) {
    }
}

export async function setupTestData(nOrgs: number, nAtts: number): Promise<testData> {
    Log.lvl1("Creating new testdata for org1");
    let admin = await TestData.init(new Data());
    await admin.createAll('admin');

    let orgs: Data[] = [];
    for (let i = 0; i < nOrgs; i++) {
        let org = new Data({alias: "org" + (i + 1)});
        await org.connectByzcoin();

        await admin.d.registerContact(org.contact, Long.fromNumber(1e6));
        await org.verifyRegistration();
        expect(org.contact.isRegistered()).toBeTruthy();
        orgs.push(org);
    }

    let atts: Data[] = [];
    for (let i = 0; i < nAtts; i++) {
        let att = new Data({alias: "att" + (i + 1)});
        await att.connectByzcoin();
        atts.push(att);
    }
    return new testData(admin, orgs, atts);
}
