import {CredentialInstance, CredentialStruct} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Log} from "~/lib/Log";
import {KeyPair, Public} from "~/lib/KeyPair";
import {Buffer} from "buffer";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {parseQRCode} from "~/lib/Scan";
import {sprintf} from "sprintf-js";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {screen} from "tns-core-modules/platform";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Signer} from "~/lib/cothority/darc/Signer";

const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

/**
 * Contact represents a user that is either registered or not. It holds
 * all data in an internal CredentialStruct, and can synchronize in two ways
 * with a CredentialInstance:
 *
 * 1. update a CredentialInstance with the current data in the CredentialStruct
 * 2. update the current data in the CredentialStruct from a CredentialInstance
 *
 * 1. is used to update the data on ByzCoin
 * 2. can be used to fetch the latest data from ByzCoin
 */
export class Contact {
    static readonly urlRegistered = "https://pop.dedis.ch/qrcode/identity-1";
    static readonly urlUnregistered = "https://pop.dedis.ch/qrcode/unregistered-1";
    credentialInstance: CredentialInstance = null;
    darcInstance: DarcInstance = null;
    coinInstance: CoinInstance = null;

    constructor(public credential: CredentialStruct = null, public unregisteredPub: Public = null) {
        if (credential == null) {
            this.credential = new CredentialStruct([]);
        }
    }

    toObject(): object {
        let o = {
            credential: this.credential.toObject(),
            darc: null,
            coinIID: null,
        };
        if (this.darcInstance) {
            o.darc = this.darcInstance.toObject();
        }
        if (this.coinInstance) {
            o.coinIID = this.coinInstance.iid.iid;
        }
        return o;
    }

    async update(bc: ByzCoinRPC): Promise<Contact> {
        if (this.darcInstance == null) {
            this.darcInstance = new DarcInstance(bc, SpawnerInstance.prepareUserDarc(this.unregisteredPub, this.alias));
        } else {
            await this.darcInstance.update();
        }
        if (this.credentialInstance == null) {
            this.credentialInstance = await CredentialInstance.fromByzcoin(this.darcInstance.bc, this.credentialIID);
        } else {
            await this.credentialInstance.update();
        }
        return this;
    }

    isRegistered(): boolean {
        return this.credentialIID != null;
    }

    getCoinAddress(): InstanceID {
        if (!this.credential || !this.credential.credentials) {
            Log.error("don't have the credentials");
            return;
        }
        for (let i = 0; i < this.credential.credentials.length; i++) {
            let c = this.credential.credentials[i];
            if (c.name == "coin") {
                if (c.attributes[0].name == "coinIID") {
                    let target = new InstanceID(c.attributes[0].value);
                    return target;
                }
            }
        }
        return null;
    }

    qrcodeIdentityStr(): string {
        let str = Contact.urlUnregistered + "?";
        if (this.isRegistered()) {
            str = sprintf("%s?credentialIID=%s&", Contact.urlRegistered, this.credentialIID.iid.toString('hex'));
        }
        str += sprintf("public_ed25519=%s&alias=%s&email=%s&phone=%s", this.pubIdentity.toHex(), this.alias, this.email, this.phone);
        return str;
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

    equals(u: Contact): boolean {
        if (this.credentialIID && u.credentialIID) {
            return this.credentialIID.iid.equals(u.credentialIID.iid);
        }
        return this.alias == u.alias;
    }

    // this method sends the current state of the Credentials to ByzCoin.
    async sendUpdate(signer: Signer) {
        if (this.credentialInstance != null) {
            await this.credentialInstance.sendUpdate(signer, this.credential);
        }
    }

    async addBC(bc: ByzCoinRPC, obj: any) {
        if (obj.credentialInstance) {
            this.credentialInstance = CredentialInstance.fromObject(bc, obj.credentialInstance);
        }
        if (obj.darc) {
            this.darcInstance = DarcInstance.fromObject(bc, obj.darc)
        }
        if (obj.coinIID) {
            this.coinInstance = await CoinInstance.fromProof(bc, await bc.getProof(new InstanceID(obj.coinIID)));
        }
    }

    async verifyRegistration(bc: ByzCoinRPC) {
        Log.lvl1("Verifying user", this.alias,
            "with public key", this.pubIdentity.toHex());
        let darcIID: InstanceID;
        if (this.darcInstance) {
            Log.lvl2("Using existing darc instance:", this.darcInstance.iid.iid);
            darcIID = this.darcInstance.iid;
        } else {
            let d = SpawnerInstance.prepareUserDarc(this.pubIdentity, this.alias);
            darcIID = new InstanceID(d.getBaseId());
            Log.lvl2("Searching for darcID:", darcIID.iid);
            let p = await bc.getProof(darcIID);
            if (!p.matchContract(DarcInstance.contractID)) {
                Log.lvl2("didn't find darcInstance");
            } else {
                this.darcInstance = await DarcInstance.fromProof(bc, p);
            }
        }

        if (!this.credentialInstance) {
            let credIID = SpawnerInstance.credentialIID(darcIID.iid);
            Log.lvl2("Searching for credIID:", credIID.iid);
            let p = await bc.getProof(credIID);
            if (!p.matchContract(CredentialInstance.contractID)) {
                Log.lvl2("didn't find credentialInstance");
            } else {
                this.credentialInstance = await CredentialInstance.fromProof(bc, p);
            }
        }

        if (!this.coinInstance) {
            let coinIID = SpawnerInstance.coinIID(darcIID.iid);
            Log.lvl2("Searching for coinIID:", coinIID.iid);
            let p = await bc.getProof(coinIID);
            if (!p.matchContract(CoinInstance.contractID)) {
                Log.lvl2("didn't find coinInstance");
            } else {
                this.coinInstance = CoinInstance.fromProof(bc, p);
            }
        }
    }

    get credentialIID(): InstanceID {
        if (!this.credentialInstance) {
            if (!this.darcInstance) {
                return null;
            }
            return SpawnerInstance.credentialIID(this.darcInstance.iid.iid);
        }
        return this.credentialInstance.iid;
    }

    get alias(): string {
        let a = this.credential.getAttribute("personal", "alias");
        if (a) {
            return a.toString();
        }
        return "";
    }

    set alias(a: string) {
        if (a) {
            this.credential.setAttribute("personal", "alias", Buffer.from(a));
        }
    }

    get email(): string {
        let e = this.credential.getAttribute("personal", "email");
        if (e) {
            return e.toString();
        }
        return "";
    }

    set email(e: string) {
        if (e) {
            this.credential.setAttribute("personal", "email", Buffer.from(e));
        }
    }

    get phone(): string {
        let p = this.credential.getAttribute("personal", "phone");
        if (p) {
            return p.toString();
        }
        return "";
    }

    set phone(p: string) {
        if (p) {
            this.credential.setAttribute("personal", "phone", Buffer.from(p));
        }
    }

    get pubIdentity(): Public {
        if (this.unregisteredPub) {
            return this.unregisteredPub;
        }
        if (this.credentialInstance) {
            return Public.fromBuffer(this.credential.getAttribute("public", "ed25519"))
        }
        Log.error("Cannot return pubIdentity!");
        return null;
    }

    static fromObject(obj: any): Contact {
        let u = new Contact();
        if (obj.credential) {
            u.credential = CredentialStruct.fromObject(obj.credential);
        }
        return u;
    }

    static async fromObjectBC(bc: ByzCoinRPC, obj: any): Promise<Contact> {
        let u = Contact.fromObject(obj);
        await u.addBC(bc, obj);
        return u;
    }

    static async fromQR(bc: ByzCoinRPC, str: string): Promise<Contact> {
        let qr = await parseQRCode(str, 5);
        let u = new Contact();
        u.alias = qr.alias;
        u.email = qr.email;
        u.phone = qr.phone;
        switch (qr.url) {
            case Contact.urlRegistered:
                u.credentialInstance = await CredentialInstance.fromByzcoin(bc,
                    new InstanceID(Buffer.from(qr.credentialIID, 'hex')));
                u.darcInstance = await DarcInstance.fromProof(bc,
                    await bc.getProof(u.credentialInstance.darcID));
                return await u.update(bc);
            case Contact.urlUnregistered:
                u.unregisteredPub = Public.fromHex(qr.public_ed25519);
                return u;
            default:
                return Promise.reject("invalid URL");
        }
    }
}
