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
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Proof, StateChangeBody} from "~/lib/cothority/byzcoin/Proof";
import {Darc} from "~/lib/cothority/darc/Darc";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";

describe("Contact tests", () => {
    describe("no byzcoin needed to test", () => {
        afterEach(() => {
            Log.print("will be overwritten");
        });

        class bcNull extends ByzCoinRPC {
            credInst: CredentialInstance;

            constructor(public credDarc: Darc) {
                super(null, null, null, null);
            };

            async getProof(iid: InstanceID): Promise<Proof> {
                let p = new Proof(null, iid);
                p.matches = true;
                if (iid.iid.equals(Buffer.alloc(32))) {
                    p.stateChangeBody = <StateChangeBody>{
                        value: this.credInst.credential.toProto(),
                        contractID: "credential",
                        darcID: this.credDarc.getBaseId()};
                } else {
                    p.stateChangeBody = <StateChangeBody>{value: this.credDarc.toProto(), contractID: "darc"};
                }
                return p;
            }
        }

        it("Simple qr-code parsing should work", async () => {
            Log.lvl1("*** simple qr-code parsing");
            let pubIdentity = Public.fromRand();
            let reg1 = new Contact(null, pubIdentity);
            reg1.alias = 'reg1';
            reg1.email = "test@test.com";
            reg1.phone = "+41 1 111 11 11";
            let bc = new bcNull(SpawnerInstance.prepareUserDarc(pubIdentity, "reg1"));
            reg1.credentialInstance = new CredentialInstance(bc,
                new InstanceID(Buffer.alloc(32)), new CredentialStruct(
                    [new Credential("public",
                        [new Attribute("ed25519", pubIdentity.toBuffer())])]));
            bc.credInst = reg1.credentialInstance;

            let str = reg1.qrcodeIdentityStr();
            let qrReg1 = await Contact.fromQR(bc, str);
            expect(str).toEqual(qrReg1.qrcodeIdentityStr());

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
});