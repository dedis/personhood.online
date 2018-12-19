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
import {Buffer} from "buffer";
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
import {User} from "~/lib/User";

/**
 * Data holds the data of the app.
 */
export class Data {
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
    users: User[] = [];

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
            this.users = obj.users ? obj.users.filter(u => u).map(u => User.fromObject(u)) : [];
        } catch (e) {
            Log.catch(e);
        }
    }

    delete() {
        this.setValues({});
        this.bc = null;
        this.darcInstance = null;
        this.credentialInstance = null;
        this.coinInstance = null;
        this.spawnerInstance = null;
        this.constructorObj = {};
    }

    async connectByzcoin(): Promise<ByzCoinRPC> {
        try {
            if (this.bc != null) {
                Log.lvl2("Not connecting if bc is already initialized");
            }
            let obj = this.constructorObj;
            if (Defaults.Testing && this.bc == null) {
                Log.lvl1("Loading data from TestStore");
                let ts = await TestStore.load(Defaults.Roster);
                Defaults.ByzCoinID = ts.bcID;
                Defaults.SpawnerIID = ts.spawnerIID;
                Log.lvl1("Stored new bcID:", ts.bcID);
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
            } else {
                if (Defaults.Testing) {
                    let ts = await TestStore.load(Defaults.Roster);
                    Defaults.SpawnerIID = ts.spawnerIID;
                }
                this.spawnerInstance = SpawnerInstance.fromProof(this.bc, await this.bc.getProof(Defaults.SpawnerIID));
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
            users: this.users.map(u => u.toObject()),
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
            let obj = {};
            if (str.length > 0) {
                obj = JSON.parse(str);
            }
            await this.setValues(obj);
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

    async canPay(amount: Long): Promise<boolean> {
        if (!(this.coinInstance && this.spawnerInstance)) {
            return Promise.reject("Cannot sign up a user without coins and spawner");
        }
        await gData.coinInstance.update();
        if (amount.lessThanOrEqual(0)) {
            return Promise.reject("Cannot send 0 or less coins");
        }
        return gData.coinInstance.coin.value.gte(amount);
    }

    dummyProgress(text: string = "", width: number = 0){
        Log.lvl2("Dummyprogress:", text, width);
    }

    async registerUser(user: User, balance: Long = Long.fromNumber(0), progress:Function = this.dummyProgress): Promise<any> {
        try {
            progress("Verifying Registration", 10);
            if (user.isRegistered()) {
                return Promise.reject("cannot register already registered user");
            }
            let pub = user.pubIdentity;
            Log.lvl2("Registering user", user.alias,
                "with public key:", Buffer.from(pub.marshalBinary()).toString('hex'));
            Log.lvl2("Registering darc");
            progress("Creating Darc", 20);
            let darcInstance = await this.spawnerInstance.createDarc(this.coinInstance,
                [this.keyIdentitySigner], pub, "new user " + user.alias);

            progress("Creating Coin", 50);
            Log.lvl2("Registering coin");
            let coinInstance = await this.spawnerInstance.createCoin(this.coinInstance,
                [this.keyIdentitySigner], darcInstance.darc.getBaseId());
            let referral = null;
            if (this.credentialInstance) {
                referral = this.credentialInstance.iid.iid;
                Log.lvl2("Adding a referral to the credentials");
            }
            Log.lvl2("Registering credential");

            progress("CreatingCredential", 80);
            let credentialInstance = await this.createUserCredentials(pub, darcInstance.iid.iid, coinInstance.iid.iid,
                referral);
            await this.coinInstance.transfer(balance, coinInstance.iid, [this.keyIdentitySigner]);
            Log.lvl2("Registered user for darc::coin::credential:", darcInstance.iid.iid, coinInstance.iid.iid,
                credentialInstance.iid.iid)
            user.credentialIID = credentialInstance.iid;
            user.credential = credentialInstance.credential;
            progress("Done", 100);
        } catch(e){
            progress("Error: " + e.toString(), -100);
            return Promise.reject(e);
        }
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
            return Promise.reject("cannot verify if no byzCoin connection is set");
        }
        Log.lvl1("Verifying user", this.alias,
            "with public key", this.keyIdentity._public.marshalBinary());
        let darcIID: InstanceID;
        if (this.darcInstance) {
            Log.lvl2("Using existing darc instance:", this.darcInstance.iid.iid);
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

    addUser(nu: User) {
        this.rmUser(nu);
        this.users.push(nu);
    }

    rmUser(nu: User) {
        this.users = this.users.filter(u => !u.equals(nu));
    }

    get user(): User {
        return User.fromData(this);
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
