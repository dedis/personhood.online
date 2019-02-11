import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {Meetup, PersonhoodRPC} from "~/lib/PersonhoodRPC";
import {PopDesc, PopPartyInstance} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {Party} from "~/lib/Party";

describe("Meetup Test", () => {
    describe("Meetup", async () => {
        let tdAdmin: TestData;
        let user1: Data;
        let user2: Data;
        let user3: Data;

        beforeAll(async () => {
            Log.lvl1("Trying to load previous byzcoin");
            user1 = new Data("player1");
            user1.setFileName("data1.json");

            user2 = new Data("player2");
            user2.setFileName("data2.json");

            user3 = new Data("player3");
            user3.setFileName("data3.json");

            try {
                await user1.load();
            } catch (e){
                Log.lvl1("Error while trying to load - going to reset chain");
                user1.contact.email = "";
            }
            if (user1.contact.email != "") {
                Log.lvl1("Probably found an existing byzcoin - using this one to speed up tests");
                await user2.load();
                await user3.load();
                user1.friends = [];
                user2.friends = [];
                user3.friends = [];
                return;
            } else {
                user1.bc = null;
            }

            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');
            user1.contact.email = "test@test.com";
            await user1.save();
            await user1.connectByzcoin();
            await tdAdmin.d.registerContact(user1.contact, Long.fromNumber(1e6));
            await user1.verifyRegistration();

            await user2.connectByzcoin();

            await user3.connectByzcoin();
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("must store meetups and give back list", async () => {
            Log.lvl1("testing that meetups correctly get sent to all nodes");
            let phrpc = new PersonhoodRPC(user1.bc);
            await phrpc.wipeMeetups();

            Log.lvl2("verify meetup list is empty");
            let meetups = await phrpc.listMeetups();
            expect(meetups.length).toEqual(0);

            Log.lvl2("verify user cannot show up twice");
            meetups = await phrpc.meetups(new Meetup(user1.contact.credentialInstance.credential, "somewhere"));
            expect(meetups.length).toEqual(1);
            meetups = await phrpc.meetups(new Meetup(user1.contact.credentialInstance.credential, "somewhere"));
            expect(meetups.length).toEqual(1);

            Log.lvl2("verify second user can join");
            meetups = await phrpc.meetups(new Meetup(user2.contact.credentialInstance.credential, "somewhere"));
            expect(meetups.length).toEqual(2);
        });
    });
});