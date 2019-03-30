require("nativescript-nodeify");

import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import {Contact} from "~/lib/Contact";
import {Public} from "~/lib/KeyPair";
import CredentialInstance, {
    Attribute,
    Credential,
    CredentialStruct
} from "~/lib/cothority/byzcoin/contracts/credentials-instance";
import ClientTransaction from "~/lib/cothority/byzcoin/client-transaction";
import ByzCoinRPC from "~/lib/cothority/byzcoin/byzcoin-rpc";
import SpawnerInstance from "~/lib/cothority/byzcoin/contracts/spawner-instance";
import {Meetup, PersonhoodRPC, UserLocation} from "~/lib/PersonhoodRPC";
import * as Long from "long";
import {FileIO} from "~/lib/FileIO";
import {Defaults} from "~/lib/Defaults";
import CoinInstance, {Coin} from "~/lib/cothority/byzcoin/contracts/coin-instance";
import {InstanceID} from "~/lib/cothority/byzcoin";
import Darc from "~/lib/cothority/darc/darc";
import Proof, {StateChangeBody} from "~/lib/cothority/byzcoin/proof";
import Instance from "~/lib/cothority/byzcoin/instance";


describe("Contact tests", () => {
    describe("no byzcoin needed to test", () => {
        afterEach(() => {
            Log.print("will be overwritten");
        });

        class nullProof extends Proof {
            constructor(public iid: InstanceID) {
                super({});
            }

            exists(k: Buffer): boolean{
                return true;
            }

            set scb(s: StateChangeBody){
                this._state = s;
            }

            // get value(): Buffer{
            //     return this.scb.value;
            // }
        }

        class bcNull extends ByzCoinRPC {
            credInst: CredentialInstance;
            coinInst: CoinInstance;

            constructor(public credDarc: Darc) {
                super();
            };

            async getProof(iid: InstanceID): Promise<Proof> {
                let p = new nullProof(iid);
                Log.print("getting proof for", iid);
                if (iid.equals(Buffer.alloc(32))) {
                    p.scb = new StateChangeBody({
                        value: this.credInst.credential.toBytes(),
                        contractid: "credential",
                        darcid: this.credDarc.getBaseID()
                    });
                } else if (iid.equals(this.coinInst.id)) {
                    p.scb = new StateChangeBody({
                        value: this.coinInst.getCoin().toBytes(),
                        contractid: "coin",
                        darcid: this.credDarc.getBaseID()
                    });
                } else {
                    p.scb = new StateChangeBody({
                        value: this.credDarc.toBytes(),
                        contractid: "darc"
                    });
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
            let bc = new bcNull(SpawnerInstance.prepareUserDarc(pubIdentity.point, "reg1"));
            reg1.credentialInstance = new CredentialInstance(bc,
                Instance.fromFields(Buffer.alloc(32), "credential", Buffer.alloc(32),
                    Buffer.alloc(0)));
            reg1.alias = 'reg1';
            reg1.email = "test@test.com";
            reg1.phone = "+41 1 111 11 11";
            reg1.credential.setAttribute("public", "ed25519", pubIdentity.toBuffer());
            let coinIID = Buffer.alloc(32);
            coinIID[0] = 1;
            reg1.credential.setAttribute("coin", "coinIID", coinIID);
            reg1.credentialInstance.credential = reg1.credential.copy();
            bc.credInst = reg1.credentialInstance;
            bc.coinInst = new CoinInstance(bc, coinIID, new Coin({
                name: coinIID,
                value: Long.fromNumber(1)
            }));
            let str = reg1.qrcodeIdentityStr();
            let qrReg1 = await Contact.fromQR(bc, str);
            expect(str).toEqual(qrReg1.qrcodeIdentityStr());
            expect(reg1.getCoinAddress().equals(coinIID)).toBeTruthy();

            let unreg2 = new Contact(null, Public.fromRand());
            unreg2.alias = 'reg1';
            unreg2.email = "test@test.com";
            unreg2.phone = "+41 1 111 11 11";
            str = unreg2.qrcodeIdentityStr();
            expect(str.startsWith(Contact.urlUnregistered)).toBeTruthy();
            let qrUnreg2 = await Contact.fromQR(bc, str);
            expect(str).toEqual(qrUnreg2.qrcodeIdentityStr());
        })
    });

    fdescribe("Contact should marshal and unmarshal", async () => {
        let tdAdmin: TestData;
        let reg1: Contact;
        let d1: Data;

        beforeAll(async () => {
            await FileIO.rmrf(Defaults.DataDir);
            d1 = new Data();
            d1.dataFileName = "reg1.json";
            try {
                await d1.load();
            } catch (e){
                Log.lvl1("d1 not here yet", d1)
            }
            let d = new Data();
            if (d1.alias == "reg1"){
                Log.lvl1("d1 is here - getting also d");
                await d.load();
                reg1 = d.contact;
            } else {
                Log.lvl1("Creating Byzcoin");
                tdAdmin = await TestData.init(d);
                Log.lvl2("createall admin");
                await tdAdmin.createAll('admin');
                Log.print(d.bc.getConfig());
                Log.print(tdAdmin.cbc.bc.getConfig());
                await d.save();
                reg1 = new Contact(null, Public.fromRand());
                reg1.alias = "reg1";
                await tdAdmin.d.registerContact(reg1);
                await reg1.verifyRegistration(d.bc);
                d1.contact = reg1;
                d1.bc = d.bc;
                await d1.save();
                Log.print("done saving");
            }
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        fit("should marshal / unmarshal contact", async () => {
            Log.lvl1("*** marshal / unmarshal contact");
            Log.lvl1("testing registered user");
            let str = JSON.stringify(reg1.toObject());
            Log.lvl2("string is:", str);
            let umReg1 = await Contact.fromObjectBC(tdAdmin.cbc.bc, JSON.parse(str));
            Log.lvl2("got contact from BC, comparing");
            expect(str).toEqual(JSON.stringify(umReg1.toObject()));

            Log.lvl1("testing unregistered user");
            let unreg2 = new Contact(null, Public.fromRand());
            unreg2.alias = "unreg2";
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
        });

        it ("should work with unregistered, but then registered user", async () => {
            let unreg = new Contact(null, Public.fromRand());
            unreg.alias = "unreg3";
            let str = unreg.qrcodeIdentityStr();
            let umUnreg3 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
            expect(umUnreg3.isRegistered()).toBeFalsy();

            Log.lvl1("registering unreg3");
            await tdAdmin.d.registerContact(unreg);
            str = unreg.qrcodeIdentityStr();
            umUnreg3 = await Contact.fromQR(tdAdmin.d.bc, str);
            expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
            expect(umUnreg3.isRegistered()).toBeTruthy();
        });
    });
//
//
//     fdescribe("With Byzcoin", async () => {
//         let tdAdmin: TestData;
//         let admin: Data;
//         let phrpc: PersonhoodRPC;
//
//         beforeAll(async () => {
//             // await FileIO.rmrf(Defaults.DataDir);
//
//             Log.lvl1("Trying to load previous byzcoin");
//             admin = new Data({alias: "admin"});
//             admin.setFileName("data1.json");
//
//             try {
//                 await admin.load();
//             } catch (e) {
//                 Log.lvl1("Error while trying to load - going to reset chain");
//                 admin.contact.email = "";
//             }
//             if (admin.contact.email != "") {
//                 Log.lvl1("Probably found an existing byzcoin - using this one to speed up tests");
//                 admin.friends = [];
//                 phrpc = new PersonhoodRPC(admin.bc);
//                 return;
//             } else {
//                 admin = new Data({alias: "admin"});
//                 admin.setFileName("data1.json");
//             }
//
//             Log.lvl1("Creating Byzcoin");
//             tdAdmin = await TestData.init(new Data());
//             await tdAdmin.createAll('admin');
//             admin.contact.email = "test@test.com";
//             await admin.connectByzcoin();
//             await tdAdmin.d.registerContact(admin.contact, Long.fromNumber(1e6));
//             await admin.verifyRegistration();
//             await admin.save();
//             phrpc = new PersonhoodRPC(admin.bc);
//         });
//
//         afterEach(() => {
//             Log.print("this line will be overwritten");
//         });
//
//         it("set recovery", async () => {
//             let one = new Data({alias: "one"});
//             one.setFileName("contactOne.json");
//             await one.connectByzcoin();
//
//             await phrpc.wipeMeetups();
//
//             await phrpc.meetups(new Meetup(UserLocation.fromContact(admin.contact)));
//             await phrpc.meetups(new Meetup(UserLocation.fromContact(one.contact)));
//             let users = await phrpc.meetups();
//
//             Log.lvl1("Updating admin");
//             let adminCopy = await users[0].toContact(admin.bc);
//             await adminCopy.update(admin.bc);
//
//             Log.lvl1("Updating one");
//             let oneCopy = await users[1].toContact(admin.bc);
//             await oneCopy.update(admin.bc);
//
//             Log.lvl1("success");
//         });
//
//         it("registration keeps alias", async () => {
//             let one = new Data({alias: "one"});
//             one.setFileName("contactOne.json");
//             await one.connectByzcoin();
//             await admin.registerContact(one.contact, Long.fromNumber(100000));
//             await one.verifyRegistration();
//             expect(one.contact.alias).toEqual("one");
//
//             let two = new Data({alias: "two"});
//             two.setFileName("contacttwo.json");
//             await two.connectByzcoin();
//
//             one.addContact(two.contact);
//             await one.registerContact(two.contact);
//             await one.friends[0].update(one.bc);
//             expect(one.friends[0].alias).toEqual("two");
//         })
//     });
});