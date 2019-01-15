import {CredentialInstance, CredentialStruct} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Data, gData} from "~/lib/Data";
import {Log} from "~/lib/Log";
import {KeyPair, Public} from "~/lib/KeyPair";
import {Buffer} from "buffer";
import {SpawnerInstance} from "~/lib/cothority/byzcoin/contracts/SpawnerInstance";
import {parseQRCode} from "~/lib/Scan";
import {sprintf} from "sprintf-js";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {screen} from "tns-core-modules/platform";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {Darc} from "~/lib/cothority/darc/Darc";

const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

/**
 * Contact represents a user outside of the data/byzcoin environment.
 * It is mainly used to exchange user information and thus does not have
 * any active methods like adding a public key, registering, or anything
 * else. All these methods are only found in the Data class.
 */
export class Contact {
    static readonly urlRegistered = "https://pop.dedis.ch/qrcode/identity-1";
    static readonly urlUnregistered = "https://pop.dedis.ch/qrcode/unregistered-1";
    credentialInstance: CredentialInstance = null;
    darcInstance: DarcInstance = null;

    constructor(public alias: string, public unregisteredPub: Public = null) {
    }

    toObject(): object {
        let o = {
            alias: this.alias,
            credential: null,
            darc: null,
        };
        if (this.credentialInstance) {
            o.credential = this.credentialInstance.toObject();
        }
        if (this.darcInstance) {
            o.darc = this.darcInstance.toObject();
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
        str += sprintf("public_ed25519=%s&alias=%s", this.pubIdentity.toHex(), this.alias);
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

    get credentialIID(): InstanceID {
        if (!this.credentialInstance) {
            if (!this.darcInstance) {
                return null;
            }
            return SpawnerInstance.credentialIID(this.darcInstance.iid.iid);
        }
        return this.credentialInstance.iid;
    }

    get credential(): CredentialStruct {
        if (!this.credentialInstance) {
            return null;
        }
        return this.credentialInstance.credential;
    }

    get pubIdentity(): Public {
        if (this.unregisteredPub) {
            return this.unregisteredPub;
        }
        if (this.credentialInstance) {
            return Public.fromBuffer(this.credentialInstance.getAttribute("public", "ed25519"))
        }
        Log.error("Cannot return pubIdentity!");
        return null;
    }

    static fromObject(bc: ByzCoinRPC, obj: any) {
        let u = new Contact(obj.alias);
        if (obj.credential) {
            u.credentialInstance = CredentialInstance.fromObject(bc, obj.credential);
        }
        if (obj.darc) {
            u.darcInstance = DarcInstance.fromObject(bc, obj.darc)
        }
        return u;
    }

    static async fromQR(bc: ByzCoinRPC, str: string): Promise<Contact> {
        let qr = await parseQRCode(str, 3);
        switch (qr.url) {
            case Contact.urlRegistered:
                let u = new Contact(qr.alias);
                u.credentialInstance = await CredentialInstance.fromByzcoin(bc,
                    new InstanceID(Buffer.from(qr.credentialIID, 'hex')));
                u.darcInstance = await DarcInstance.fromProof(bc,
                    await bc.getProof(u.credentialInstance.darcID));
                return await u.update(bc);
            case Contact.urlUnregistered:
                return new Contact(qr.alias, Public.fromHex(qr.public_ed25519));
            default:
                return Promise.reject("invalid URL");
        }
    }
}
