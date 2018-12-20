import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import {User} from "~/lib/User";
import {Public} from "~/lib/KeyPair";
import {CredentialStruct} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";

describe("no byzcoin needed to test", ()=>{
    afterEach(()=>{
        Log.print("will be overwritten");
        Log.print("will be overwritten");
    });

    it("Simple qr-code parsing should work", async () =>{
        let reg1 = new User('reg1');
        reg1.pubIdentity = Public.fromRand();
        reg1.credential = new CredentialStruct([]);
        reg1.credentialIID = new InstanceID(Buffer.alloc(32));

        let unreg2 = new User('reg1');
        unreg2.pubIdentity = Public.fromRand();

        let str = reg1.qrcodeIdentityStr();
        let qrReg1 = await User.fromQR(null, str);
        expect(str).toEqual(qrReg1.qrcodeIdentityStr());

        str = unreg2.qrcodeIdentityStr();
        let qrUnreg2 = await User.fromQR(null, str);
        expect(str).toEqual(qrUnreg2.qrcodeIdentityStr());
    })
});

describe("User should marshal and unmarshal", async () => {
    let tdAdmin: TestData;
    let reg1: User;
    let unreg2: User;

    beforeAll(async () => {
        Log.lvl1("Creating Byzcoin");
        tdAdmin = await TestData.init(new Data());
        await tdAdmin.createAll('admin');
        reg1 = new User("reg1");
        reg1.pubIdentity = Public.fromRand();
        await tdAdmin.d.registerUser(reg1);
        unreg2 = new User("unreg2");
        unreg2.pubIdentity = Public.fromRand();
    });

    afterEach(() => {
        Log.print("this line will be overwritten");
        Log.print("this line will be overwritten");
    });

    it("Should work with users stored in byzcoin", async () => {
    });

    it("should marshal / unmarshal user", async () => {
        Log.lvl1("testing registered user");
        let str = JSON.stringify(reg1.toObject());
        Log.lvl2("string is:", str);
        let umReg1 = User.fromObject(JSON.parse(str));
        expect(str).toEqual(JSON.stringify(umReg1.toObject()));

        Log.lvl1("testing unregistered user");
        str = JSON.stringify(unreg2.toObject());
        let umUnreg2 = User.fromObject(JSON.parse(str));
        expect(str).toEqual(JSON.stringify(umUnreg2.toObject()));

        Log.lvl1("testing qrcode on registered");
        str = reg1.qrcodeIdentityStr();
        umReg1 = await User.fromQR(tdAdmin.d.bc, str);
        expect(str).toEqual(umReg1.qrcodeIdentityStr());

        Log.lvl1("testing qrcode on unregistered");
        str = unreg2.qrcodeIdentityStr();
        umUnreg2 = await User.fromQR(tdAdmin.d.bc, str);
        expect(str).toEqual(umUnreg2.qrcodeIdentityStr());

        Log.lvl1("testing unregistered, but then registered user");
        let unreg3 = new User("unreg3");
        unreg3.pubIdentity = Public.fromRand();
        str = unreg3.qrcodeIdentityStr();
        let umUnreg3 = await User.fromQR(tdAdmin.d.bc, str);
        expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
        expect(umUnreg3.isRegistered()).toBeFalsy();

        Log.lvl1("registering unreg3");
        await tdAdmin.d.registerUser(unreg3);
        str = unreg3.qrcodeIdentityStr();
        umUnreg3 = await User.fromQR(tdAdmin.d.bc, str);
        expect(str).toEqual(umUnreg3.qrcodeIdentityStr());
        expect(umUnreg3.isRegistered()).toBeTruthy();
    });
});