/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {PersonhoodParty, PersonhoodRPC, PollStruct} from "~/lib/PersonhoodRPC";

const curve = require("@dedis/kyber-js").curve.newCurve("edwards25519");
const Schnorr = require("@dedis/kyber-js").sign.schnorr;

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
    CredentialStruct, RecoverySignature
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
import {SocialNode} from "~/lib/SocialNode";
import {sprintf} from "sprintf-js";
import {parseQRCode} from "~/lib/Scan";
import {Signature} from "~/lib/cothority/darc/Signature";

/**
 * Data holds the data of the app.
 */
export class Data {
    dataFileName: string;
    continuousScan: boolean;
    personhoodPublished: boolean;
    keyPersonhood: KeyPair;
    keyIdentity: KeyPair;
    bc: ByzCoinRPC = null;
    spawnerInstance: SpawnerInstance = null;
    constructorObj: any;
    contact: Contact = null;
    friends: Contact[] = [];
    parties: Party[] = [];
    badges: Badge[] = [];
    ropascis: RoPaSciInstance[] = [];
    polls: PollStruct[] = [];
    meetups: SocialNode[] = [];

    // Non-stored fields
    recoverySignatures: RecoverySignature[] = [];

    static readonly urlRecoveryRequest = "https://pop.dedis.ch/recoveryReq-1";
    static readonly urlRecoverySignature = "https://pop.dedis.ch/recoverySig-1";

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
            this.continuousScan = obj.continuousScan ? obj.continuousScan : false;
            this.personhoodPublished = obj.personhoodPublished ? obj.personhoodPublished : false;
            this.keyPersonhood = obj.keyPersonhood ? new KeyPair(obj.keyPersonhood) : new KeyPair();
            this.keyIdentity = obj.keyIdentity ? new KeyPair(obj.keyIdentity) : new KeyPair();
            this.meetups = obj.meetups ? obj.meetups.map(m => SocialNode.fromObject(m)) : [];

            if (obj.contact != null) {
                this.contact = Contact.fromObject(obj.contact);
            } else {
                this.contact = new Contact(null, this.keyIdentity._public);
            }
            if (obj.alias && obj.alias != "") {
                this.contact.alias = obj.alias;
            }
            if (obj.email && obj.email != "") {
                this.contact.email = obj.email;
            }
        } catch (e) {
            Log.catch(e);
        }
    }

    delete() {
        this.setValues({});
        this.bc = null;
        this.spawnerInstance = null;
        this.constructorObj = {};
        this.meetups = [];
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
            if (Defaults.LoadTestStore && this.bc == null) {
                Log.lvl1("Loading data from TestStore");
                let ts = await TestStore.load(Defaults.Roster);
                Defaults.ByzCoinID = ts.bcID;
                Defaults.SpawnerIID = ts.spawnerIID.iid;
                Log.lvl1("Updated Defaults bcID/spawnerIID:", ts.bcID, ts.spawnerIID.iid);
            }

            let bcID = obj.bcID ? Buffer.from(obj.bcID) : Defaults.ByzCoinID;
            let roster = obj.roster ? Roster.fromObject(obj.roster) : Defaults.Roster;
            if (bcID == null || bcID.length == 0) {
                if (Defaults.Testing) {
                    return;
                } else {
                    return Promise.reject("Cannot connect to ByzCoin");
                }
            }
            this.bc = await ByzCoinRPC.fromByzcoin(new RosterSocket(roster, RequestPath.BYZCOIN), bcID);

            Log.lvl2("Getting spawnerInstance");
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

            Log.lvl2("getting parties and badges");
            if (obj.parties) {
                this.parties = obj.parties.map(p => Party.fromObject(this.bc, p));
            }
            if (obj.badges) {
                this.badges = obj.badges.map(b => Badge.fromObject(this.bc, b));
                this.badges = this.badges.filter((badge, i) =>
                    this.badges.findIndex(b => b.party.uniqueName == badge.party.uniqueName) == i);
            }

            Log.lvl2("Getting rock-paper-scissors and polls");
            if (obj.ropascis) {
                this.ropascis = obj.ropascis.map(rps => RoPaSciInstance.fromObject(this.bc, rps));
            }
            if (obj.polls) {
                this.polls = obj.polls.map(rps => PollStruct.fromObject(rps));
            }

            if (obj.contact) {
                await this.contact.addBC(this.bc, obj.contact)
            }

            Log.lvl2("Getting contact informations");
            this.friends = [];
            if (obj.friends) {
                let f = obj.friends.filter(u => u);
                for (let i = 0; i < f.length; i++) {
                    this.friends.push(await Contact.fromObjectBC(this.bc, f[i]));
                }
            }
        } catch (e) {
            await Log.rcatch(e);
        }
        return this.bc;
    }

    toObject(): any {
        let v = {
            continuousScan: this.continuousScan,
            personhoodPublished: this.personhoodPublished,
            keyPersonhood: this.keyPersonhood._private.toHex(),
            keyIdentity: this.keyIdentity._private.toHex(),
            friends: this.friends.map(u => u.toObject()),
            meetups: this.meetups.map(m => m.toObject()),
            contact: this.contact.toObject(),
            bcRoster: null,
            bcID: null,
            darcInstance: null,
            credentialInstance: null,
            coinInstance: null,
            spawnerInstance: null,
            parties: [],
            badges: [],
            ropascis: [],
            polls: [],
        };
        if (this.bc) {
            v.bcRoster = this.bc.config.roster.toObject();
            v.bcID = this.bc.bcID;
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
            try {
                Log.lvl2("Personhood not yet stored - adding to credential");
                this.contact.credential.setAttribute("personhood",
                    "ed25519", this.keyPersonhood._public.toBuffer());
                await this.contact.sendUpdate(this.keyIdentitySigner);
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
        } catch (e) {
            Log.catch(e);
        }
        this.bc = null;
        await this.connectByzcoin();
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(this.dataFileName, JSON.stringify(this.toObject()));
        if (this.personhoodPublished) {
            this.contact.credential.setAttribute("personhood",
                "ed25519", this.keyPersonhood._public.toBuffer());
        }
        await this.contact.sendUpdate(this.keyIdentitySigner);
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
            if (this.contact.credentialInstance) {
                referral = this.contact.credentialInstance.iid.iid;
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
        await this.contact.verifyRegistration(this.bc);
    }

    // setRecovery stores the given contacts in the credential, so that a threshold of these contacts
    // can recover the darc. Only one set of contacts for recovery can be stored.
    async setRecovery(threshold: number, cs: Contact[]): Promise<any> {
        if (cs.filter(c => c.isRegistered()).length != cs.length) {
            return Promise.reject("not all contacts are registered");
        }
        let thresholdBuf = Buffer.alloc(4);
        thresholdBuf.writeUInt32LE(threshold, 0);
        this.contact.credential.setAttribute("recover", "threshold", thresholdBuf);
        let recoverBuf = Buffer.alloc(32 * cs.length);
        cs.forEach((c, i) =>
            cs[i].darcInstance.iid.iid.copy(recoverBuf, i * 32, 0, 32));
        this.contact.credential.setAttribute("recover", "trustees", recoverBuf);
        return this.contact.sendUpdate(this.keyIdentitySigner);
    }

    // searchRecovery searches all contacts to know if this user is in the list of recovery possibilities.
    // It also updates all contacts by getting proofs from byzcoin.
    async searchRecovery(): Promise<Contact[]> {
        let recoveries: Contact[] = [];
        for (let i = 0; i < this.friends.length; i++) {
            await this.friends[i].update(this.bc);
            let recoveryTrustees = this.friends[i].credential.getAttribute("recover", "trustees");
            if (recoveryTrustees != null) {
                for (let j = 0; j < recoveryTrustees.length; j += 32) {
                    if (this.contact.darcInstance.iid.iid.compare(recoveryTrustees, j, j + 32) == 0) {
                        recoveries.push(this.friends[i]);
                        break;
                    }
                }
            }
        }
        return recoveries;
    }

    // recoveryRequest returns a string for a qrcode that holds the new public key of the new user.
    recoveryRequest(): string {
        return sprintf("%s?public=%s", Data.urlRecoveryRequest, this.keyIdentity._public.toHex());
    }

    // RecoverySignature returns a string for a qrcode that holds the signature to be used to proof that this
    // trustee is OK with recovering a given account.
    async recoverySignature(request: string, user: Contact): Promise<string> {
        let requestObj = parseQRCode(request, 1);
        if (requestObj.url != Data.urlRecoveryRequest) {
            return Promise.reject("not a recovery request");
        }
        if (!requestObj.public) {
            return Promise.reject("recovery request is missing public argument");
        }
        let publicKey = Buffer.from(requestObj.public, "hex");
        if (publicKey.length != RecoverySignature.pub) {
            return Promise.reject("got wrong public key length");
        }

        await user.update(this.bc);

        // the message to be signed is:
        // credentialIID + newPublicKey + latestDarcVersion
        let msg = Buffer.alloc(RecoverySignature.msgBuf);
        user.credentialIID.iid.copy(msg);
        publicKey.copy(msg, RecoverySignature.credIID);
        msg.writeUInt32LE(user.darcInstance.darc.version,RecoverySignature.credIID + RecoverySignature.pub);

        let sig = Schnorr.sign(curve, this.keyIdentity._private.scalar, new Uint8Array(msg));
        let sigBuf = Buffer.alloc(RecoverySignature.pubSig);
        this.keyIdentity._public.toBuffer().copy(sigBuf);
        Buffer.from(sig).copy(sigBuf, RecoverySignature.pub);
        Log.print("public key is:", this.keyIdentity._public.toBuffer());
        Log.print("signature buffer:", sigBuf);

        return sprintf("%s?credentialIID=%s&pubSig=%s", Data.urlRecoverySignature,
            user.credentialIID.iid.toString("hex"),
            sigBuf.toString("hex"));
    }

    async recoveryStore(signature: string): Promise<string> {
        let sigObj = parseQRCode(signature, 2);
        if (sigObj.url != Data.urlRecoverySignature) {
            return Promise.reject("not a recovery signature");
        }
        if (!sigObj.credentialIID || !sigObj.pubSig) {
            return Promise.reject("credentialIID or signature missing");
        }
        let credIID = InstanceID.fromHex(sigObj.credentialIID);
        let pubSig = Buffer.from(sigObj.pubSig, "hex");
        if (pubSig.length != RecoverySignature.pubSig) {
            return Promise.reject("signature should be of length 64");
        }

        if (this.recoverySignatures.length > 0){
            if (!this.recoverySignatures[0].credentialIID.equals(credIID)){
                this.recoverySignatures = [];
            }
        }
        this.recoverySignatures.push(new RecoverySignature(credIID, pubSig));
    }

    // recoveryUser returns the user that is currently being recovered.
    async recoveryUser(): Promise<Contact> {
        if (this.recoverySignatures.length == 0){
            return Promise.reject("don't have any recovery signatures stored yet.");
        }
        return Contact.fromByzcoin(this.bc, this.recoverySignatures[0].credentialIID);
    }

    // recoverIdentity sends all received signatures to the credential instance, thus evolving the
    // darc to include our new public key.
    async recoverIdentity(): Promise<any> {
        this.contact = await this.recoveryUser();
        await this.contact.credentialInstance.recoverIdentity(this.keyIdentity._public, this.recoverySignatures);
        this.recoverySignatures = [];
        await this.contact.darcInstance.update();
        await this.verifyRegistration();
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
        let phParties = await phrpc.listParties();
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
        await phrpc.listParties(p.partyInstance.iid);
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

    get keyIdentitySigner(): Signer {
        return new SignerEd25519(this.keyIdentity._public.point, this.keyIdentity._private.scalar);
    }

    get darcInstance(): DarcInstance {
        return this.contact.darcInstance;
    }

    get coinInstance(): CoinInstance {
        return this.contact.coinInstance;
    }

    get credentialInstance(): CredentialInstance {
        return this.contact.credentialInstance;
    }

    get alias(): string {
        return this.contact.alias;
    }

    get uniqueMeetings(): number {
        let meetups = this.meetups.map(m => Contact.sortAlias(m.users));
        let unique = meetups.filter((meetup, i) =>
            meetups.findIndex(m => m.join() == meetup.join()) == i);
        return unique.length;
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
        this.d.contact.alias = alias;
        this.d.contact.darcInstance = await this.cbc.spawner.createUserDarc(this.cbc.genesisCoin,
            [this.cbc.bc.admin], this.d.keyIdentity._public, alias);
        Log.lvl2("Created user darc", this.d.darcInstance.iid.iid)
    }

    async createUserCoin() {
        Log.lvl1("Creating user coin");
        this.d.contact.coinInstance = await this.cbc.spawner.createCoin(this.cbc.genesisCoin,
            [this.cbc.bc.admin], this.d.darcInstance.darc.getBaseId());
        await this.cbc.genesisCoin.transfer(Long.fromNumber(1e9), this.d.coinInstance.iid, [this.cbc.bc.admin]);
        Log.lvl2("Created user coin with 1e9 coins", this.d.coinInstance.iid.iid)
    }

    async createUserCredentials() {
        this.d.contact.credentialInstance = await this.d.createUserCredentials();
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
