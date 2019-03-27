import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import {Contact} from "~/lib/Contact";
import {Public} from "~/lib/KeyPair";
import {
    Attribute,
    Credential,
    CredentialInstance,
    CredentialStruct
} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {ClientTransaction, InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Proof, StateChangeBody} from "~/lib/cothority/byzcoin/Proof";
import {Darc} from "~/lib/cothority/darc/Darc";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Meetup, PersonhoodRPC, UserLocation} from "~/lib/PersonhoodRPC";
import * as Long from "long";
import {FileIO} from "~/lib/FileIO";
import {Defaults} from "~/lib/Defaults";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";

fdescribe("Contact tests", () => {
    fdescribe("no byzcoin needed to test", () => {
        afterEach(() => {
            Log.print("will be overwritten");
        });

        class bcNull extends ByzCoinRPC {
            credInst: CredentialInstance;
            coinInst: CoinInstance;

            constructor(public credDarc: Darc) {
                super(null, null, null, null);
            };

            async getProof(iid: InstanceID): Promise<Proof> {
                let p = new Proof(null, iid);
                Log.print("getting proof for", iid.iid);
                p.matches = true;
                if (iid.iid.equals(Buffer.alloc(32))) {
                    p.stateChangeBody = <StateChangeBody>{
                        value: this.credInst.credential.toProto(),
                        contractID: "credential",
                        darcID: this.credDarc.getBaseId()
                    };
                } else if (iid.iid.equals(this.coinInst.iid.iid)) {
                    p.stateChangeBody = <StateChangeBody>{
                        value: this.coinInst.coin.toProto(),
                        contractID: "coin",
                        darcID: this.credDarc.getBaseId()
                    };
                } else {
                    p.stateChangeBody = <StateChangeBody>{value: this.credDarc.toProto(), contractID: "darc"};
                }
                return p;
            }

            async sendTransactionAndWait(transaction: ClientTransaction, wait: number = 5): Promise<any> {
                Log.print(transaction);
            }
        }

        it("Simple qr-code parsing should work", async () => {
            Log.lvl1("*** simple qr-code parsing");
            let pubIdentity = Public.fromRand();
            let reg1 = new Contact(null, pubIdentity);
            let bc = new bcNull(SpawnerInstance.prepareUserDarc(pubIdentity, "reg1"));
            reg1.credentialInstance = new CredentialInstance(bc,
                new InstanceID(Buffer.alloc(32)), new CredentialStruct([]));
            reg1.alias = 'reg1';
            reg1.email = "test@test.com";
            reg1.phone = "+41 1 111 11 11";
            reg1.credential.setAttribute("public", "ed25519", pubIdentity.toBuffer());
            let coinIID = Buffer.alloc(32);
            coinIID[0] = 1;
            reg1.credential.setAttribute("coin", "coinIID", coinIID);
            reg1.credentialInstance.credential = reg1.credential.copy();
            bc.credInst = reg1.credentialInstance;
            bc.coinInst = new CoinInstance(bc, new InstanceID(coinIID), new Coin({name:coinIID, value: Long.fromNumber(1)}));
            Log.print(1);
            let str = reg1.qrcodeIdentityStr();
            Log.print(4);
            let qrReg1 = await Contact.fromQR(bc, str);
            Log.print(3);
            expect(str).toEqual(qrReg1.qrcodeIdentityStr());
            expect(reg1.getCoinAddress().iid.equals(coinIID)).toBeTruthy();

            let unreg2 = new Contact(null, Public.fromRand());
            unreg2.alias = 'reg1';
            unreg2.email = "test@test.com";
            unreg2.phone = "+41 1 111 11 11";
            str = unreg2.qrcodeIdentityStr();
            Log.print(2);
            expect(str.startsWith(Contact.urlUnregistered)).toBeTruthy();
            let qrUnreg2 = await Contact.fromQR(bc, str);
            expect(str).toEqual(qrUnreg2.qrcodeIdentityStr());
        })
    });

    describe("Contact should marshal and unmarshal", async () => {
        let tdAdmin: TestData;
        let reg1: Contact;
        let unreg2: Contact;

        beforeAll(async () => {
            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');
            reg1 = new Contact(null, Public.fromRand());
            reg1.alias = "reg1";
            await tdAdmin.d.registerContact(reg1);
            unreg2 = new Contact(null, Public.fromRand());
            unreg2.alias = "unreg2";
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("should marshal / unmarshal contact", async () => {
            Log.lvl1("*** marshal / unmarshal contact");
            Log.lvl1("testing registered user");
            let str = JSON.stringify(reg1.toObject());
            Log.lvl2("string is:", str);
            let umReg1 = await Contact.fromObjectBC(tdAdmin.cbc.bc, JSON.parse(str));
            expect(str).toEqual(JSON.stringify(umReg1.toObject()));

            Log.lvl1("testing unregistered user");
            str = JSON.stringify(unreg2.toObject());
            let umUnreg2 = await Contact.fromObjectBC(tdAdmin.cbc.bc, JSON.parse(str));
            expect(str).toEqual(JSON.stringify(umUnreg2.toObject()));

            Log.lvl1("testing qrcode on registered");
            str = reg1.qrcodeIdentityStr();
            umReg1 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umReg1.qrcodeIdentityStr());

            Log.lvl1("testing qrcode on unregistered");
            str = unreg2.qrcodeIdentityStr();
            umUnreg2 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umUnreg2.qrcodeIdentityStr());

            Log.lvl1("testing unregistered, but then registered user");
            let unreg3 = new Contact(null, Public.fromRand());
            unreg3.alias = "unreg3";
            str = unreg3.qrcodeIdentityStr();
            let umUnreg3 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
            expect(umUnreg3.isRegistered()).toBeFalsy();

            Log.lvl1("registering unreg3");
            await tdAdmin.d.registerContact(unreg3);
            str = unreg3.qrcodeIdentityStr();
            umUnreg3 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
            expect(umUnreg3.isRegistered()).toBeTruthy();
        });
    });


    fdescribe("With Byzcoin", async () => {
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
            let one = new Data({alias: "one"});
            one.setFileName("contactOne.json");
            await one.connectByzcoin();

            await phrpc.wipeMeetups();

            await phrpc.meetups(new Meetup(UserLocation.fromContact(admin.contact)));
            await phrpc.meetups(new Meetup(UserLocation.fromContact(one.contact)));
            let users = await phrpc.meetups();

            Log.lvl1("Updating admin");
            let adminCopy = await users[0].toContact(admin.bc);
            await adminCopy.update(admin.bc);

            Log.lvl1("Updating one");
            let oneCopy = await users[1].toContact(admin.bc);
            await oneCopy.update(admin.bc);

            Log.lvl1("success");
        });

        it("registration keeps alias", async()=>{
            let one = new Data({alias: "one"});
            one.setFileName("contactOne.json");
            await one.connectByzcoin();
            await admin.registerContact(one.contact, Long.fromNumber(100000));
            await one.verifyRegistration();
            expect(one.contact.alias).toEqual("one");

            let two = new Data({alias: "two"});
            two.setFileName("contacttwo.json");
            await two.connectByzcoin();

            one.addContact(two.contact);
            await one.registerContact(two.contact);
            await one.friends[0].update(one.bc);
            expect(one.friends[0].alias).toEqual("two");
        })
    });
});