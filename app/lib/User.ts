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

const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

export class User {
    static readonly urlCred = "https://pop.dedis.ch/qrcode/identity?";
    static readonly urlUnregistered = "https://pop.dedis.ch/qrcode/unregistered?";
    credentialIID: InstanceID = null;
    credential: CredentialStruct = null;
    pubIdentity: any;

    constructor(public alias: string) {
    }

    toObject(): object {
        let o = {
            alias: this.alias,
            pubIdentity: Buffer.from(this.pubIdentity.marshalBinary()),
            credential: null,
            credentialIID: null,
        };
        if (this.credential) {
            o.credential = this.credential.toProto().toString('hex');
        }
        if (this.credentialIID) {
            o.credentialIID = this.credentialIID.iid.toString('hex');
        }
        return o;
    }

    async update(bc: ByzCoinRPC) {
        if (this.credentialIID == null) {
            let darcIID = SpawnerInstance.darcIID(this.pubIdentity, this.alias);
            this.credentialIID = SpawnerInstance.credentialIID(darcIID.iid);
        }
        if (this.credential == null) {
            this.credential = (await CredentialInstance.fromByzcoin(bc, this.credentialIID)).credential;
        }
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
        let str = User.urlUnregistered;
        if (this.credentialIID) {
            str = sprintf("%scredentialIID:%s+", User.urlCred, this.credentialIID.iid.toString('hex'));
        }
        str += sprintf("public_ed25519:%s+alias:%s",
            Buffer.from(this.pubIdentity.marshalBinary()).toString('hex'), this.alias);
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

    equals(u: User): boolean {
        if (this.credentialIID && u.credentialIID) {
            return this.credentialIID.iid.equals(u.credentialIID.iid);
        }
        return this.alias == u.alias;
    }

    static fromObject(obj: any) {
        let u = new User(obj.alias);
        if (obj.pubIdentity) {
            u.pubIdentity = Public.fromHex(obj.pubIdentity);
        }
        if (obj.credential) {
            u.credential = CredentialStruct.fromProto(Buffer.from(obj.credential, 'hex'));
        }
        if (obj.credentialIID) {
            u.credentialIID = InstanceID.fromHex(obj.credentialIID);
        }
        return u;
    }

    static async fromQR(bc: ByzCoinRPC, str: string): Promise<User> {
        let qr = await parseQRCode(str, 3);
        let u = new User(qr.alias);
        Log.print("parsing string", str, "for qr-code", qr);
        if (qr.public_ed25519) {
            u.pubIdentity = Public.fromHex(qr.public_ed25519);
        }
        if (qr.credentialIID) {
            u.credentialIID = InstanceID.fromHex(qr.credentialIID);
            if (bc) {
                await u.update(bc);
            }
        }
        return u;
    }

    static fromData(d: Data) {
        let u = new User(d.alias);
        u.pubIdentity = d.keyIdentity._public;
        if (d.credentialInstance) {
            u.credentialIID = d.credentialInstance.iid;
            u.credential = d.credentialInstance.credential;
        }
        return u;
    }
}
