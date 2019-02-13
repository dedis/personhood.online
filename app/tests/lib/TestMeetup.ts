import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {Meetup, PersonhoodRPC, UserLocation} from "~/lib/PersonhoodRPC";
import {PopDesc, PopPartyInstance} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {Party} from "~/lib/Party";
import {FileIO} from "~/lib/FileIO";
import {Defaults} from "~/lib/Defaults";

fdescribe("Meetup Test", () => {
    fdescribe("Meetup", async () => {
        let tdAdmin: TestData;
        let user1: Data;
        let user2: Data;
        let user3: Data;
        let phrpc: PersonhoodRPC;

        beforeAll(async () => {
            // await FileIO.rmrf(Defaults.DataDir);

            Log.lvl1("Trying to load previous byzcoin");
            user1 = new Data({alias: "user1"});
            user1.setFileName("data1.json");

            user2 = new Data({alias: "user2"});
            user2.setFileName("data2.json");

            user3 = new Data({alias: "user3"});
            user3.setFileName("data3.json");

            try {
                await user1.load();
            } catch (e) {
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
                phrpc = new PersonhoodRPC(user1.bc);
                return;
            } else {
                user1 = new Data({alias: "user1"});
                user1.setFileName("data1.json");
            }

            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');
            user1.contact.email = "test@test.com";
            await user1.connectByzcoin();
            await tdAdmin.d.registerContact(user1.contact, Long.fromNumber(1e6));
            await user1.verifyRegistration();
            await user1.save();

            await user2.connectByzcoin();

            await user3.connectByzcoin();
            phrpc = new PersonhoodRPC(user1.bc);
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("test user1", async () => {
            await phrpc.wipeMeetups();
            await phrpc.meetups(new Meetup(UserLocation.fromContact(user1.contact)));
            let users = await phrpc.meetups();
            return;

            expect(user1.spawnerInstance).not.toBe(null);
            let unreg1 = new Data({alias: "unreg1"});
            await unreg1.connectByzcoin();
            try {
                await user1.registerContact(unreg1.contact);
            } catch (e) {
                Log.error(e);
            }
            await unreg1.verifyRegistration();
            expect(unreg1.contact.isRegistered()).toBe(true);
        });

        it("must store meetups and give back list", async () => {
            Log.lvl1("testing that meetups correctly get sent to all nodes");
            await phrpc.wipeMeetups();

            Log.lvl2("verify meetup list is empty");
            let meetups = await phrpc.listMeetups();
            expect(meetups.length).toEqual(0);

            Log.lvl2("verify user cannot show up twice");
            meetups = await phrpc.meetups(new Meetup(UserLocation.fromContact(user1.contact)));
            expect(meetups.length).toEqual(1);
            meetups = await phrpc.meetups(new Meetup(UserLocation.fromContact(user1.contact)));
            expect(meetups.length).toEqual(1);

            Log.lvl2("verify second user can join");
            meetups = await phrpc.meetups(new Meetup(UserLocation.fromContact(user2.contact)));
            expect(meetups.length).toEqual(2);

            Log.lvl2("verify third user can join");
            meetups = await phrpc.meetups(new Meetup(UserLocation.fromContact(user3.contact)));
            expect(meetups.length).toEqual(3);

            Log.lvl2("verify second user can join and overrides");
            meetups = await phrpc.meetups(new Meetup(UserLocation.fromContact(user2.contact)));
            expect(meetups.length).toEqual(3);
        });

        fit("must reload contacts correctly after a save/load cycle", async () => {
            Log.lvl1("testing that meetups correctly get sent to all nodes");
            await phrpc.wipeMeetups();
            let unreg1 = new Data({alias: "unreg1"});
            unreg1.setFileName("unreg1.json");
            await unreg1.connectByzcoin();
            let unreg2 = new Data({alias: "unreg2"});
            unreg2.setFileName("unreg2.json");
            await unreg2.connectByzcoin();

            let users = [user1, unreg1, unreg2];
            for (let i = 0; i < users.length; i++) {
                await phrpc.meetups(new Meetup(UserLocation.fromContact(users[i].contact)));
            }

            for (let i = 0; i < users.length; i++) {
                let uls = await phrpc.listMeetups();
                for (let j = 0; j < uls.length; j++) {
                    let c = await uls[j].toContact(user1.bc);
                    await c.verifyRegistration(user1.bc);
                    users[i].addContact(c);
                }
                await users[i].save();
                await users[i].load();

                expect(users[i].friends.length).toBe(users.length, "after save/load");
                expect(users[i].friends[0].isRegistered()).toBe(true);
                expect(users[i].friends[1].isRegistered()).toBe(false);
                expect(users[i].friends[2].isRegistered()).toBe(false);
            }

            await user1.registerContact(user1.friends[1]);

            for (let i = 0; i < users.length; i++) {
                await users[i].load();

                expect(users[i].friends.length).toBe(users.length, "after save/load");
                expect(users[i].friends[0].isRegistered()).toBe(true);
                expect(users[i].friends[1].isRegistered()).toBe(true);
                expect(users[i].friends[2].isRegistered()).toBe(false);

                await users[i].save();
            }

            for (let i = 0; i < users.length; i++) {
                await users[i].load();
                expect(users[i].friends.length).toBe(users.length, "after save/load");
                expect(users[i].friends[0].isRegistered()).toBe(true);
                expect(users[i].friends[1].isRegistered()).toBe(true);
                expect(users[i].friends[2].isRegistered()).toBe(false);
            }
        });
    });
});