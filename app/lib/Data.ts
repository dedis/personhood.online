/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {Proof} from "~/lib/cothority/byzcoin/Proof";

require("nativescript-nodeify");

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";

const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

import * as Long from "long";
import {Defaults} from "~/lib/Defaults";
import {FileIO} from "~/lib/FileIO";
import {Log} from "~/lib/Log";
import {KeyPair, Public} from "~/lib/KeyPair";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {Buffer} from "buffer";
import {screen} from "tns-core-modules/platform";
import {RosterSocket, WebSocket, Socket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {
    Attribute,
    Credential,
    CredentialInstance,
    CredentialStruct
} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Roster} from "~/lib/network/Roster";
import {CreateByzCoin} from "~/tests/lib/cothority/byzcoin/stdByzcoin";
import {TestStore} from "~/lib/network/TestStorage";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Signer} from "~/lib/cothority/darc/Signer";
import {SignerEd25519} from "~/lib/cothority/darc/SignerEd25519";
import {sprintf} from "sprintf-js";

/**
 * Data holds the data of the app.
 */
export class Data {
    static readonly urlCred = "https://pop.dedis.ch/qrcode/identity?";
    static readonly urlUnregistered = "https://pop.dedis.ch/qrcode/unregistered?";
    dataFileName: string = Defaults.DataDir + "/" + "data.json";

    alias: string;
    email: string;
    continuousScan: boolean;
    keyPersonhood: KeyPair;
    keyIdentity: KeyPair;
    bc: ByzCoinRPC = null;
    darcInstance: DarcInstance = null;
    credentialInstance: CredentialInstance = null;
    coinInstance: CoinInstance = null;
    spawnerInstance: SpawnerInstance = null;
    constructorObj: any;

    /**
     * Constructs a new Data, optionally initialized with an object containing
     * fields for initialization of the class.
     * @param obj (optional) object with all fields for the class.
     */
    constructor(obj: any = {}) {
        this.constructorObj = obj;
        this.setValues(obj);
    }

    setValues(obj: any) {
        this.constructorObj = obj;
        try {
            this.alias = obj.alias ? obj.alias : "";
            this.email = obj.email ? obj.email : "";
            this.continuousScan = obj.continuousScan ? obj.continuousScan : false;
            this.keyPersonhood = obj.keyPersonhood ? new KeyPair(Buffer.from(obj.keyPersonhood).toString('hex')) : new KeyPair();
            this.keyIdentity = obj.keyIdentity ? new KeyPair(Buffer.from(obj.keyIdentity).toString('hex')) : new KeyPair();
        } catch (e) {
            Log.catch(e);
        }
    }

    async connectByzcoin(): Promise<ByzCoinRPC> {
        try {
            if (this.bc != null) {
                Log.lvl2("Not connecting if bc is already initialized");
            }
            let obj = this.constructorObj;
            if (Defaults.Testing && obj.bcID == null) {
                Log.lvl2("Not initializing bc with Defaults when testing");
                return;
            }
            let bcID = obj.bcID ? Buffer.from(obj.bcID) : Defaults.ByzCoinID;
            let roster = obj.roster ? Roster.fromObject(obj.roster) : Defaults.Roster;
            this.bc = await ByzCoinRPC.fromByzcoin(new RosterSocket(roster, RequestPath.BYZCOIN), bcID);
            if (obj.darcInstance) {
                let di = new InstanceID(Buffer.from(obj.darcInstance));
                this.darcInstance = DarcInstance.fromProof(this.bc, await this.bc.getProof(di));
            }
            if (obj.credentialInstance) {
                let ci = new InstanceID(Buffer.from(obj.credentialInstance));
                this.credentialInstance = CredentialInstance.fromProof(this.bc, await this.bc.getProof(ci));
            }
            if (obj.coinInstance) {
                let ci = new InstanceID(Buffer.from(obj.coinInstance));
                this.coinInstance = CoinInstance.fromProof(this.bc, await this.bc.getProof(ci));
            }
            if (obj.spawnerInstance) {
                let ci = new InstanceID(Buffer.from(obj.spawnerInstance));
                this.spawnerInstance = SpawnerInstance.fromProof(this.bc, await this.bc.getProof(ci));
            }
        } catch (e) {
            Log.catch(e);
        }
        return this.bc;
    }

    getValues(): any {
        let v = {
            alias: this.alias,
            email: this.email,
            continuousScan: this.continuousScan,
            keyPersonhood: Buffer.from(this.keyPersonhood._private.marshalBinary()),
            keyIdentity: Buffer.from(this.keyIdentity._private.marshalBinary()),
            bcRoster: null,
            bcID: null,
            darcInstance: null,
            credentialInstance: null,
            coinInstance: null,
            spawnerInstance: null,
        };
        if (this.bc) {
            v.bcRoster = this.bc.config.roster.toObject();
            v.bcID = this.bc.bcID;
            v.darcInstance = this.darcInstance ? this.darcInstance.iid.iid : null;
            v.credentialInstance = this.credentialInstance ? this.credentialInstance.iid.iid : null;
            v.coinInstance = this.coinInstance ? this.coinInstance.iid.iid : null;
            v.spawnerInstance = this.spawnerInstance ? this.spawnerInstance.iid.iid : null;
        }
        return v;
    }

    /**
     * Returns a promise with the loaded Data in it, when available. If the file
     * is not found, it returns an empty data.
     */
    async load(): Promise<Data> {
        try {
            let str = await FileIO.readFile(this.dataFileName);
            if (str.length > 0) {
                let obj = JSON.parse(str);
                await this.setValues(obj);
            }
            await this.connectByzcoin()
        } catch (e) {
            Log.catch(e);
        }
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(this.dataFileName, JSON.stringify(this.getValues()));
        return this;
    }

    qrcodeIdentityStr(): string {
        if (this.credentialInstance) {
            return Data.urlCred + sprintf("credentials:%s+alias:%s",
                this.credentialInstance.iid.iid.toString('hex'), this.alias);
        } else {
            return Data.urlUnregistered + sprintf("public_ed25519:%s+alias:%s",
                Buffer.from(this.keyIdentity._public.marshalBinary()).toString('hex'), this.alias);
        }
    }

    qrcodeIdentity(): ImageSource {
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: this.qrcodeIdentityStr(),
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }

    static parseQRCode(str: string): any {
        let url = str.split("?", 2);
        if (url.length != 2){
            throw new Error("wrong QRCode");
        }
        let parts = url[1].split("+", 2);
        if (parts.length != 2){
            throw new Error("wrong QRCode");
        }
        let ret = {};
        parts.forEach(p => {
            let r = p.split(":", 2);
            ret[r[0]] = r[1];
        });
        return ret;
    }

    async registerUser(user: string, balance: Long = Long.fromNumber(0)) {
        if (!user.startsWith(Data.urlUnregistered)) {
            throw new Error("this is not an unregistered user");
        }
        let qrObj = Data.parseQRCode(user);
        if (!qrObj.public_ed25519 || !qrObj.alias) {
            throw new Error("wrong data for registered user");
        }
        let pub = Public.fromBuffer(Buffer.from(qrObj.public_ed25519, 'hex'));
        let alias = qrObj.alias;

        Log.lvl2("Registering user with public key:", Buffer.from(pub.marshalBinary()).toString('hex'));
        let darcInstance = await this.spawnerInstance.createDarc(this.coinInstance,
            [this.keyIdentitySigner], pub, "new user " + alias);
        let coinInstance = await this.spawnerInstance.createCoin(this.coinInstance,
            [this.keyIdentitySigner], darcInstance.darc.getBaseId());
        let referral = null;
        if (this.credentialInstance) {
            referral = this.credentialInstance.iid.iid;
            Log.lvl2("Adding a referral to the credentials");
        }
        let credentialInstance = await this.createUserCredentials(pub, darcInstance.iid.iid, coinInstance.iid.iid,
            referral);
        await this.coinInstance.transfer(balance, coinInstance.iid, [this.keyIdentitySigner]);
        Log.lvl2("Registered user for darc::coin::credential:", darcInstance.iid.iid, coinInstance.iid.iid,
            credentialInstance.iid.iid)
    }

    async createUserCredentials(pub: any = this.keyIdentity._public,
                                darcID: Buffer = this.darcInstance.iid.iid,
                                coinIID: Buffer = this.coinInstance.iid.iid,
                                referral: Buffer = null): Promise<CredentialInstance> {
        Log.lvl1("Creating user credential");
        let credPub = new Credential("public",
            [new Attribute("ed25519", pub.marshalBinary())]);
        let credDarc = new Credential("darc",
            [new Attribute("darcID", darcID)]);
        let credCoin = new Credential("coin",
            [new Attribute("coinIID", coinIID)]);
        let cred = new CredentialStruct([credPub, credDarc, credCoin]);
        if (referral) {
            cred.credentials[0].attributes.push(new Attribute("referred", referral));
        }
        return await this.spawnerInstance.createCredential(this.coinInstance,
            [this.keyIdentitySigner], darcID, cred);
    }

    async verifyRegistration() {
        if (this.bc == null) {
            throw new Error("cannot verify if no byzCoin connection is set");
        }
        let darcIID: InstanceID;
        if (this.darcInstance) {
            darcIID = this.darcInstance.iid;
        } else {
            let d = SpawnerInstance.prepareDarc(this.keyIdentity._public, "new user " + this.alias);
            darcIID = new InstanceID(d.getBaseId());
            Log.lvl2("Searching for darcID:", darcIID.iid);
            let p = await this.bc.getProof(darcIID);
            if (!p.matchContract(DarcInstance.contractID)) {
                Log.lvl2("didn't find darcInstance");
            } else {
                this.darcInstance = DarcInstance.fromProof(this.bc, p);
            }
        }

        if (!this.credentialInstance) {
            let credIID = SpawnerInstance.credentialIID(darcIID.iid);
            Log.lvl2("Searching for credIID:", credIID.iid);
            let p = await this.bc.getProof(credIID);
            if (!p.matchContract(CredentialInstance.contractID)) {
                Log.lvl2("didn't find credentialInstance");
            } else {
                this.credentialInstance = CredentialInstance.fromProof(this.bc, p);
            }
        }

        if (!this.coinInstance) {
            let coinIID = SpawnerInstance.coinIID(darcIID.iid);
            Log.lvl2("Searching for coinIID:", coinIID.iid);
            let p = await this.bc.getProof(coinIID);
            if (!p.matchContract(CoinInstance.contractID)) {
                Log.lvl2("didn't find coinInstance");
            } else {
                this.coinInstance = CoinInstance.fromProof(this.bc, p);
            }
        }
    }

    get keyIdentitySigner(): Signer {
        return new SignerEd25519(this.keyIdentity._public, this.keyIdentity._private);
    }


}

export class TestData {
    constructor(public d: Data, public cbc: CreateByzCoin) {
    }

    static async init(d: Data): Promise<TestData> {
        Log.lvl1("Creating ByzCoin");
        let td = new TestData(d, await CreateByzCoin.start());
        await TestStore.save(Defaults.Roster, td.cbc.bc.bcID, td.cbc.spawner.iid);
        await td.d.setValues({});
        td.d.bc = td.cbc.bc;
        td.d.spawnerInstance = td.cbc.spawner;
        td.d.keyIdentity = new KeyPair(Buffer.from(td.cbc.bc.admin.private.marshalBinary()).toString('hex'));
        return td;
    }

    async createUserDarc(alias: string) {
        Log.lvl1("Creating user darc");
        this.d.alias = alias;
        this.d.darcInstance = await this.cbc.spawner.createDarc(this.cbc.genesisCoin,
            [this.cbc.bc.admin], this.d.keyIdentity._public, "new user");
        Log.lvl2("Created user darc", this.d.darcInstance.iid.iid)
    }

    async createUserCoin() {
        Log.lvl1("Creating user coin");
        this.d.coinInstance = await this.cbc.spawner.createCoin(this.cbc.genesisCoin,
            [this.cbc.bc.admin], this.d.darcInstance.darc.getBaseId());
        await this.cbc.genesisCoin.transfer(Long.fromNumber(1e9), this.d.coinInstance.iid, [this.cbc.bc.admin]);
        Log.lvl2("Created user coin with 1e9 coins", this.d.coinInstance.iid.iid)
    }

    async createUserCredentials() {
        this.d.credentialInstance = await this.d.createUserCredentials();
    }

    async createAll(alias: string) {
        await this.createUserDarc(alias);
        await this.createUserCoin();
        await this.createUserCredentials();
    }
}

/**
 * gData can be used as a global data in the app. However, when using it outside
 * of the UI, it is important to always pass the data, so that it is simpler to
 * test the libraries.
 */
export var gData = new Data();
