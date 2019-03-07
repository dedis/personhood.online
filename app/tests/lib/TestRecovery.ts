import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {Meetup, PersonhoodRPC, UserLocation} from "~/lib/PersonhoodRPC";
import {PopDesc, PopPartyInstance} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {Party} from "~/lib/Party";
import {FileIO} from "~/lib/FileIO";
import {Defaults} from "~/lib/Defaults";
import {Contact} from "~/lib/Contact";

fdescribe("Recovery Test", () => {
    fdescribe("Recovery", async () => {
        let tdAdmin: TestData;
        let admin: Data;
        let phrpc: PersonhoodRPC;

        beforeAll(async () => {
            // await FileIO.rmrf(Defaults.DataDir);

            Log.lvl1("Trying to load previous byzcoin");
            admin = new Data({alias: "admin"});
            admin.setFileName("data1.json");

            try {
                await admin.load();
            } catch (e) {
                Log.lvl1("Error while trying to load - going to reset chain");
                admin.contact.email = "";
            }
            if (admin.contact.email != "") {
                Log.lvl1("Probably found an existing byzcoin - using this one to speed up tests");
                admin.friends = [];
                phrpc = new PersonhoodRPC(admin.bc);
                return;
            } else {
                admin = new Data({alias: "admin"});
                admin.setFileName("data1.json");
            }

            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');
            admin.contact.email = "test@test.com";
            await admin.connectByzcoin();
            await tdAdmin.d.registerContact(admin.contact, Long.fromNumber(1e6));
            await admin.verifyRegistration();
            await admin.save();
            phrpc = new PersonhoodRPC(admin.bc);
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("set recovery", async () => {
            Log.lvl1("setting up users");
            let user1 = new Data({alias: "user1"});
            user1.setFileName("dataUser1.json");
            await admin.registerContact(user1.contact, Long.fromNumber(1000));
            await user1.connectByzcoin();
            await user1.verifyRegistration();
            let user2 = new Data({alias: "user2"});
            user2.setFileName("dataUser2.json");
            await user2.connectByzcoin();
            let user3 = new Data({alias: "user3"});
            user3.setFileName("dataUser3.json");
            await user3.connectByzcoin();

            Log.lvl1("should reject recovery using unregistered users");
            await expectAsync(user1.setRecovery(2, [user2.contact, user3.contact])).toBeRejected();

            Log.lvl1("registering user2 and user3");
            await user1.registerContact(user2.contact);
            await user2.verifyRegistration();
            await user1.registerContact(user3.contact);
            await user3.verifyRegistration();

            Log.lvl1("should allow setting of recovery for registered users");
            user2.addContact(user1.contact);
            user3.addContact(user1.contact);
            expect((await user2.searchRecovery()).length).toBe(0);
            await user1.setRecovery(2, [user2.contact, user3.contact]);
            expect((await user2.searchRecovery()).length).toBe(1);
            expect((await user3.searchRecovery()).length).toBe(1);

            Log.lvl1("Create new user and recover data");
            let user1New = new Data({alias: "user1New"});
            await user1New.connectByzcoin();
            let recoveryRequest = user1New.recoveryRequest();
            let recoverySig2 = await user2.recoverySignature(recoveryRequest, user1.contact);
            await user1New.recoveryStore(recoverySig2);
            expect((await user1New.recoveryUser()).toObject()).not.toEqual(user1.contact.toObject());
            await expectAsync(user1New.recoverIdentity()).toBeRejected();

            let recoverySig3 = await user3.recoverySignature(recoveryRequest, user1.contact);
            await user1New.recoveryStore(recoverySig3);
            await user1New.recoverIdentity();
            expect(user1New.contact.credential.toObject()).toEqual(user1.contact.credential.toObject());
        });

        fit("recover multiple users", async () => {
            Log.lvl1("setting up users");
            let nbrRecovery = 2;
            let nbrTrustees = 3;
            let recoveries: Data[] = [];
            let trustees: Data[] = [];
            for (let user = 0; user < nbrRecovery + nbrTrustees; user++) {
                let name = "recovery" + user;
                if (user >= nbrRecovery) {
                    name = "trustee" + user;
                }
                Log.lvl1("Creating user", name);
                let d = new Data({alias: name});
                d.setFileName("data" + name + ".json");
                await admin.registerContact(d.contact, Long.fromNumber(1000));
                await d.connectByzcoin();
                await d.verifyRegistration();
                if (user < nbrRecovery) {
                    recoveries.push(d);
                } else {
                    trustees.push(d);
                }
            }

            Log.lvl1("should allow setting of recovery for registered users");
            for (let recovery = 0; recovery < nbrRecovery; recovery++) {
                let rs: Contact[] = [];
                for (let trustee = 0; trustee < nbrTrustees; trustee++) {
                    trustees[trustee].addContact(recoveries[recovery].contact);
                    rs.push(trustees[trustee].contact);
                }
                await recoveries[recovery].setRecovery(nbrTrustees, rs);
            }
            for (let trustee = 0; trustee < nbrTrustees; trustee++) {
                expect((await trustees[trustee].searchRecovery()).length).toBe(nbrRecovery);
            }

            for (let newUser = 0; newUser < nbrRecovery; newUser++) {
                let name = "newUser" + newUser;
                Log.lvl1("Create new user and recover data:", name);
                let userNew = new Data({alias: name});
                await userNew.connectByzcoin();
                let recoveryRequest = userNew.recoveryRequest();

                for (let trustee = 0; trustee < nbrTrustees; trustee++) {
                    let recoverySig = await trustees[trustee].recoverySignature(recoveryRequest, recoveries[newUser].contact);
                    await userNew.recoveryStore(recoverySig);
                }
                await userNew.recoverIdentity();
                expect(userNew.contact.credential.toObject()).toEqual(recoveries[newUser].contact.credential.toObject());
            }
        });
    });
});