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
import {CredentialInstance} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";

describe("setup byzcoin and create party", () => {
    afterEach(() => {
        Log.print("Buffer print that will be overwritten in case of error");
    });

    let p256 = Buffer.from("p256");
    let persEd = Buffer.from("persEd");
    let persEmail = Buffer.from("email@mail.com");

    function testCredBase(d: Data, cred: CredentialInstance){
        expect(cred.getAttribute("public", "ed25519")).not.toBe(d.keyIdentity._public.toBuffer());
        expect(cred.getAttribute("darc", "darcID")).not.toBe(d.darcInstance.iid.iid);
        expect(cred.getAttribute("coin", "coinIID")).not.toBe(d.coinInstance.iid.iid);
    }

    function testCredNew(cred: CredentialInstance){
        expect(cred.getAttribute("public", "p256")).toEqual(p256);
        expect(cred.getAttribute("personhood", "ed25519")).toEqual(persEd);
        expect(cred.getAttribute("personhood", "email")).toEqual(persEmail);
    }

    it("Add credential and attributes", async () => {
        Log.lvl1("Creating new org1");
        let admin = await TestData.init(new Data());
        await admin.createAll('admin');

        Log.lvl1("Checking basic credentials");
        let cred = admin.d.credentialInstance;
        testCredBase(admin.d, cred);

        Log.lvl1("Setting new attributes");
        await cred.setAttribute(admin.d.keyIdentitySigner, "public", "p256", p256);
        await cred.setAttribute(admin.d.keyIdentitySigner, "personhood", "ed25519", persEd);
        await cred.setAttribute(admin.d.keyIdentitySigner, "personhood", "email", persEmail);

        Log.lvl1("Checking basic and new attributes");
        testCredBase(admin.d, cred);
        testCredNew(cred);

        Log.lvl1("Getting copy of credentials and checking");
        let credCopy = await CredentialInstance.fromByzcoin(admin.d.bc, cred.iid)
        testCredBase(admin.d, credCopy);
        testCredNew(credCopy);
    });
});
