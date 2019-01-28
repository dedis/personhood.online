/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {PersonhoodParty, PersonhoodRPC, PollStruct} from "~/lib/PersonhoodRPC";

require("nativescript-nodeify");

import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";

import * as Long from "long";
import {Defaults} from "~/lib/Defaults";
import {FileIO} from "~/lib/FileIO";
import {Log} from "~/lib/Log";
import {KeyPair, Public} from "~/lib/KeyPair";
import {Buffer} from "buffer";
import {RosterSocket} from "~/lib/network/NSNet";
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
import {TestStore} from "~/lib/network/TestStore";
import {SpawnerCoin, SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {Signer} from "~/lib/cothority/darc/Signer";
import {SignerEd25519} from "~/lib/cothority/darc/SignerEd25519";
import {Contact} from "~/lib/Contact";
import {Badge} from "~/lib/Badge";
import {Party} from "~/lib/Party";
import {PopPartyInstance} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {elRoPaSci} from "~/pages/lab/ropasci/ropasci-page";

/**
 * Data holds the data of the app.
 */
export class Data {
    dataFileName: string;
    alias: string;
    email: string;
    continuousScan: boolean;
    personhoodPublished: boolean;
    keyPersonhood: KeyPair;
    keyIdentity: KeyPair;
    bc: ByzCoinRPC = null;
    darcInstance: DarcInstance = null;
    credentialInstance: CredentialInstance = null;
    coinInstance: CoinInstance = null;
    spawnerInstance: SpawnerInstance = null;
    constructorObj: any;
    friends: Contact[] = [];
    parties: Party[] = [];
    badges: Badge[] = [];
    ropascis: RoPaSciInstance[] = [];
    polls: PollStruct[] = [];

    /**
     * Constructs a new Data, optionally initialized with an object containing
     * fields for initialization of the class.
     * @param obj (optional) object with all fields for the class.
     */
    constructor(obj: any = {}) {
        this.constructorObj = obj;
        this.setValues(obj);
        this.setFileName("data.json");
    }

    setFileName(n: string) {
        this.dataFileName = Defaults.DataDir + "/" + n;
    }

    setValues(obj: any) {
        this.constructorObj = obj;
        try {
            this.alias = obj.alias ? obj.alias : "";
            this.email = obj.email ? obj.email : "";
            this.continuousScan = obj.continuousScan ? obj.continuousScan : false;
            this.personhoodPublished = obj.personhoodPublished ? obj.personhoodPublished : false;
            this.keyPersonhood = obj.keyPersonhood ? new KeyPair(obj.keyPersonhood) : new KeyPair();
            this.keyIdentity = obj.keyIdentity ? new KeyPair(obj.keyIdentity) : new KeyPair();
            this.friends = obj.friends ? obj.friends.filter(u => u).map(u => Contact.fromObject(this.bc, u)) : [];
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
        this.parties = [];
        this.badges = [];
        this.ropascis = [];
        this.polls = [];
    }

    async connectByzcoin(): Promise<ByzCoinRPC> {
        try {
            if (this.bc != null) {
                Log.lvl2("Not connecting if bc is already initialized");
                return this.bc;
            }
            let obj = this.constructorObj;
            if (Defaults.Testing && this.bc == null) {
                Log.lvl1("Loading data from TestStore");
                let ts = await TestStore.load(Defaults.Roster);
                Defaults.ByzCoinID = ts.bcID;
                Defaults.SpawnerIID = ts.spawnerIID.iid;
                Log.lvl1("Stored new bcID:", ts.bcID);
            }
            let bcID = obj.bcID ? Buffer.from(obj.bcID) : Defaults.ByzCoinID;
            let roster = obj.roster ? Roster.fromObject(obj.roster) : Defaults.Roster;
            this.bc = await ByzCoinRPC.fromByzcoin(new RosterSocket(roster, RequestPath.BYZCOIN), bcID);
            if (obj.darcInstance) {
                let di = new InstanceID(Buffer.from(obj.darcInstance));
                this.darcInstance = await DarcInstance.fromProof(this.bc, await this.bc.getProof(di));
            }
            if (obj.credentialInstance) {
                let ci = new InstanceID(Buffer.from(obj.credentialInstance));
                this.credentialInstance = await CredentialInstance.fromProof(this.bc, await this.bc.getProof(ci));
            }
            if (obj.coinInstance) {
                let ci = new InstanceID(Buffer.from(obj.coinInstance));
                this.coinInstance = CoinInstance.fromProof(this.bc, await this.bc.getProof(ci));
            }
            if (obj.spawnerInstance) {
                let ci = new InstanceID(Buffer.from(obj.spawnerInstance));
                this.spawnerInstance = await SpawnerInstance.fromProof(this.bc, await this.bc.getProof(ci));
            } else {
                if (Defaults.Testing) {
                    let ts = await TestStore.load(Defaults.Roster);
                    Defaults.SpawnerIID = ts.spawnerIID.iid;
                }
            }
            if (!this.spawnerInstance) {
                this.spawnerInstance = await SpawnerInstance.fromProof(this.bc,
                    await this.bc.getProof(new InstanceID(Defaults.SpawnerIID)));
            }
            if (obj.parties) {
                this.parties = obj.parties.map(p => Party.fromObject(this.bc, p));
            }
            if (obj.badges) {
                this.badges = obj.badges.map(b => Badge.fromObject(this.bc, b));
                this.badges = this.badges.filter((badge, i) =>
                    this.badges.findIndex(b => b.party.uniqueName == badge.party.uniqueName) == i);
            }
            if (obj.ropascis) {
                this.ropascis = obj.ropascis.map(rps => RoPaSciInstance.fromObject(this.bc, rps));
            }
            if (obj.polls) {
                this.polls = obj.polls.map(rps => PollStruct.fromObject(rps));
            }
        } catch (e) {
            await Log.rcatch(e);
        }
        return this.bc;
    }

    toObject(): any {
        let v = {
            alias: this.alias,
            email: this.email,
            continuousScan: this.continuousScan,
            personhoodPublished: this.personhoodPublished,
            keyPersonhood: this.keyPersonhood._private.toHex(),
            keyIdentity: this.keyIdentity._private.toHex(),
            friends: this.friends.map(u => u.toObject()),
            bcRoster: null,
            bcID: null,
            darcInstance: null,
            credentialInstance: null,
            coinInstance: null,
            spawnerInstance: null,
            parties: null,
            badges: null,
            ropascis: null,
            polls: null,
        };
        if (this.bc) {
            v.bcRoster = this.bc.config.roster.toObject();
            v.bcID = this.bc.bcID;
            v.darcInstance = this.darcInstance ? this.darcInstance.iid.iid : null;
            v.credentialInstance = this.credentialInstance ? this.credentialInstance.iid.iid : null;
            v.coinInstance = this.coinInstance ? this.coinInstance.iid.iid : null;
            v.spawnerInstance = this.spawnerInstance ? this.spawnerInstance.iid.iid : null;
            v.parties = this.parties ? this.parties.map(p => p.toObject()) : null;
            v.badges = this.badges ? this.badges.map(b => b.toObject()) : null;
            v.ropascis = this.ropascis ? this.ropascis.map(rps => rps.toObject()) : null;
            v.polls = this.polls ? this.polls.map(rps => rps.toObject()) : null;
        }
        return v;
    }

    async publishPersonhood(publish: boolean) {
        this.personhoodPublished = publish;
        if (publish) {
            // if (!this.credentialInstance.getAttribute("personhood", "ed25519")) {
            try {
                Log.lvl2("Personhood not yet stored - adding to credential");
                await this.credentialInstance.setAttribute(this.keyIdentitySigner, "personhood",
                    "ed25519", this.keyPersonhood._public.toBuffer());
                // }
            } catch (e) {
                Log.catch(e);
            }
        }
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
            await this.connectByzcoin();
        } catch (e) {
            Log.catch(e);
        }
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(this.dataFileName, JSON.stringify(this.toObject()));
        return this;
    }

    async canPay(amount: Long): Promise<boolean> {
        if (!(this.coinInstance && this.spawnerInstance)) {
            return Promise.reject("Cannot sign up a contact without coins and spawner");
        }
        await this.coinInstance.update();
        if (amount.lessThanOrEqual(0)) {
            return Promise.reject("Cannot send 0 or less coins");
        }
        if (amount.greaterThanOrEqual(this.coinInstance.coin.value)) {
            return Promise.reject("You only have " + this.coinInstance.coin.value.toString() + " coins.");
        }
        return true;
    }

    dummyProgress(text: string = "", width: number = 0) {
        Log.lvl2("Dummyprogress:", text, width);
    }

    async registerContact(contact: Contact, balance: Long = Long.fromNumber(0), progress: Function = this.dummyProgress): Promise<any> {
        try {
            progress("Verifying Registration", 10);
            if (contact.isRegistered()) {
                return Promise.reject("cannot register already registered contact");
            }
            let pub = contact.pubIdentity;
            Log.lvl2("Registering contact", contact.alias,
                "with public key:", pub.toHex());
            Log.lvl2("Registering darc");
            progress("Creating Darc", 20);
            let darcInstance = await this.spawnerInstance.createUserDarc(this.coinInstance,
                [this.keyIdentitySigner], pub, contact.alias);

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

            progress("Creating Credential", 80);
            let credentialInstance = await this.createUserCredentials(pub, darcInstance.iid.iid, coinInstance.iid.iid,
                referral);
            await this.coinInstance.transfer(balance, coinInstance.iid, [this.keyIdentitySigner]);
            Log.lvl2("Registered user for darc::coin::credential:", darcInstance.iid.iid, coinInstance.iid.iid,
                credentialInstance.iid.iid);
            await contact.update(this.bc);
            progress("Done", 100);
        } catch (e) {
            Log.catch(e);
            progress("Error: " + e.toString(), -100);
            return Promise.reject(e);
        }
    }

    async createUserCredentials(pub: Public = this.keyIdentity._public,
                                darcID: Buffer = this.darcInstance.iid.iid,
                                coinIID: Buffer = this.coinInstance.iid.iid,
                                referral: Buffer = null): Promise<CredentialInstance> {
        Log.lvl1("Creating user credential");
        let credPub = new Credential("public",
            [new Attribute("ed25519", pub.toBuffer())]);
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
            "with public key", this.keyIdentity._public.toHex());
        let darcIID: InstanceID;
        if (this.darcInstance) {
            Log.lvl2("Using existing darc instance:", this.darcInstance.iid.iid);
            darcIID = this.darcInstance.iid;
        } else {
            let d = SpawnerInstance.prepareUserDarc(this.keyIdentity._public, this.alias);
            darcIID = new InstanceID(d.getBaseId());
            Log.lvl2("Searching for darcID:", darcIID.iid);
            let p = await this.bc.getProof(darcIID);
            if (!p.matchContract(DarcInstance.contractID)) {
                Log.lvl2("didn't find darcInstance");
            } else {
                this.darcInstance = await DarcInstance.fromProof(this.bc, p);
            }
        }

        if (!this.credentialInstance) {
            let credIID = SpawnerInstance.credentialIID(darcIID.iid);
            Log.lvl2("Searching for credIID:", credIID.iid);
            let p = await this.bc.getProof(credIID);
            if (!p.matchContract(CredentialInstance.contractID)) {
                Log.lvl2("didn't find credentialInstance");
            } else {
                this.credentialInstance = await CredentialInstance.fromProof(this.bc, p);
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

    addContact(nu: Contact) {
        this.rmContact(nu);
        this.friends.push(nu);
    }

    rmContact(nu: Contact) {
        this.friends = this.friends.filter(u => !u.equals(nu));
    }

    async reloadParties(): Promise<Party[]> {
        let phrpc = new PersonhoodRPC(this.bc);
        let phParties = await phrpc.listPartiesRPC();
        await Promise.all(phParties.map(async php => {
            if (this.parties.find(p => p.partyInstance.iid.equals(php.instanceID)) == null) {
                Log.lvl2("Found new party id");
                let ppi = await PopPartyInstance.fromByzcoin(this.bc, php.instanceID);
                Log.lvl2("Found new party", ppi.popPartyStruct.description.name);
                let orgKeys = await ppi.fetchOrgKeys();
                let p = new Party(ppi);
                p.isOrganizer = !!orgKeys.find(k => k.equal(this.keyPersonhood._public));
                this.parties.push(p);
            }
        }));
        Log.lvl2("finished with searching");
        await this.save();
        return this.parties;
    }

    async updateParties(): Promise<Party[]> {
        await Promise.all(this.parties.map(async p => p.partyInstance.update()));
        // Move all finalized parties into badges
        let parties: Party[] = [];
        this.parties.forEach(p => {
            if (p.state == Party.Finalized) {
                if (p.partyInstance.popPartyStruct.attendees.keys.find(k =>
                    k.equal(this.keyPersonhood._public))) {
                    this.badges.push(new Badge(p, this.keyPersonhood));
                }
                Log.lvl2("removing party that doesn't have our key stored");
            } else {
                parties.push(p);
            }
        });
        this.parties = parties;
        await this.save();
        return this.parties;
    }

    async addParty(p: Party) {
        this.parties.push(p);
        let phrpc = new PersonhoodRPC(this.bc);
        await this.save();
        await phrpc.listPartiesRPC(p.partyInstance.iid);
    }

    async reloadRoPaScis(): Promise<RoPaSciInstance[]> {
        let phrpc = new PersonhoodRPC(this.bc);
        let phRoPaScis = await phrpc.listRPS();
        await Promise.all(phRoPaScis.map(async rps => {
            if (this.ropascis.find(r => r.iid.equals(rps.instanceID)) == null) {
                Log.lvl2("Found new ropasci");
                let rpsInst = await RoPaSciInstance.fromByzcoin(this.bc, rps.instanceID);
                let rpss = rpsInst.roPaSciStruct;
                Log.lvl2("RoPaSciInstance is:", rpss.description, rpss.firstPlayer, rpss.secondPlayer);
                this.ropascis.push(rpsInst);
            }
        }));
        Log.lvl2("finished with searching");
        await this.save();
        return this.ropascis;
    }

    async updateRoPaScis(): Promise<RoPaSciInstance[]> {
        await Promise.all(this.ropascis
            .filter(rps => rps.roPaSciStruct.firstPlayer < 0)
            .map(async rps => rps.update()));
        await this.save();
        return this.ropascis;
    }

    async addRoPaSci(rps: RoPaSciInstance) {
        this.ropascis.push(rps);
        let phrpc = new PersonhoodRPC(this.bc);
        await this.save();
        await phrpc.listRPS(rps.iid)
    }

    async delRoPaSci(rps: RoPaSciInstance) {
        let i = this.ropascis.findIndex(r => r.iid.equals(rps.iid));
        if (i >= 0) {
            this.ropascis.splice(i, 1);
        }
        await this.save();
    }

    async reloadPolls(): Promise<PollStruct[]> {
        let phrpc = new PersonhoodRPC(this.bc);
        this.polls = await phrpc.pollList(gData.badges.map(b => b.party.partyInstance.iid));
        return this.polls;
    }

    async addPoll(personhood: InstanceID, title: string, description: string, choices: string[]): Promise<PollStruct> {
        let phrpc = new PersonhoodRPC(this.bc);
        let rps = await phrpc.pollNew(personhood, title, description, choices);
        this.polls.push(rps);
        await this.save();
        return rps;
    }

    async delPoll(rps: PollStruct) {
        let i = this.polls.findIndex(r => r.pollID.equals(rps.pollID));
        if (i >= 0) {
            this.polls.splice(i, 1);
            await this.save();
        }
    }

    get contact(): Contact {
        let c = new Contact(this.alias);
        if (this.darcInstance) {
            c.darcInstance = this.darcInstance;
        }
        if (this.credentialInstance) {
            c.credentialInstance = this.credentialInstance;
        } else {
            c.unregisteredPub = this.keyIdentity._public;
        }
        return c;
    }

    get keyIdentitySigner(): Signer {
        return new SignerEd25519(this.keyIdentity._public.point, this.keyIdentity._private.scalar);
    }
}

export class TestData {
    constructor(public d: Data, public cbc: CreateByzCoin) {
    }

    static async init(d: Data): Promise<TestData> {
        Log.lvl1("Creating new ByzCoin");
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
        this.d.darcInstance = await this.cbc.spawner.createUserDarc(this.cbc.genesisCoin,
            [this.cbc.bc.admin], this.d.keyIdentity._public, alias);
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

export class CreateByzCoin {
    constructor(public bc: ByzCoinRPC = null, public spawner: SpawnerInstance = null,
                public genesisDarcIID: InstanceID = null, public genesisCoin: CoinInstance = null) {
    }

    async addUser(alias: string, balance: Long = Long.fromNumber(0)): Promise<cbcUser> {
        Log.lvl1("Creating user with spawner");
        Log.lvl1("Spawning darc");
        let user = new KeyPair();
        let userDarc = await this.spawner.createUserDarc(this.genesisCoin,
            [this.bc.admin], user._public, alias);

        Log.lvl1("Spawning coin");
        let userCoin = await this.spawner.createCoin(this.genesisCoin,
            [this.bc.admin], userDarc.darc.getBaseId(), Long.fromNumber(1e6));
        return new cbcUser(userDarc, userCoin);
    }

    static async start(): Promise<CreateByzCoin> {
        let bc = await ByzCoinRPC.newLedger(Defaults.Roster,
            ["spawn:spawner", "spawn:coin",
                "invoke:mint", "invoke:transfer", "invoke:fetch"]);

        Log.lvl1("Creating genesis-account");
        let genesisDarcIID = new InstanceID(bc.genesisDarc.getBaseId());
        Log.lvl2("Created genesis-iid", bc.genesisDarc.getBaseId());
        let genesisCoin = await CoinInstance.create(bc, genesisDarcIID, [bc.admin], SpawnerCoin);
        Log.lvl2("Created coin", genesisCoin.iid.iid);
        Log.lvl1("Minting some money");
        await genesisCoin.mint([bc.admin],
            Long.fromNumber(1e10));

        Log.lvl1("Creating spawner");
        let spawner = await SpawnerInstance.create(bc, genesisDarcIID,
            [bc.admin],
            Long.fromNumber(100), Long.fromNumber(100),
            Long.fromNumber(100), Long.fromNumber(1e7),
            genesisCoin.iid);
        Log.lvl2("Created spawner:", spawner.iid.iid);
        return new CreateByzCoin(bc, spawner, genesisDarcIID, genesisCoin);
    }
}

export class cbcUser {
    constructor(public darcInst: DarcInstance, public coinInst: CoinInstance) {
    }
}

/**
 * gData can be used as a global data in the app. However, when using it outside
 * of the UI, it is important to always pass the data, so that it is simpler to
 * test the libraries.
 */
export var gData = new Data();
