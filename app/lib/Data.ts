/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";

require("nativescript-nodeify");

const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

import {Defaults} from "~/lib/Defaults";
import {FileIO} from "~/lib/FileIO";
import {Log} from "~/lib/Log";
import {KeyPair} from "~/lib/KeyPair";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {Buffer} from "buffer";
import {screen} from "tns-core-modules/platform";
import {RosterSocket, WebSocket, Socket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";
import {CredentialInstance} from "~/lib/cothority/byzcoin/contracts/CredentialInstance";
import {CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Roster} from "~/lib/network/Roster";

export const dataFileName = "data.json";

/**
 * Data holds the data of the app.
 */
export class Data {
    alias: string;
    email: string;
    continuousScan: boolean;
    keyPersonhood: KeyPair;
    keyIdentity: KeyPair;
    bc: ByzCoinRPC;
    darcInstance: DarcInstance;
    credentialInstance: CredentialInstance;
    coinInstance: CoinInstance;
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
        };
        if (this.bc) {
            v.bcRoster = this.bc.config.roster.toObject();
            v.bcID = this.bc.bcID;
            v.darcInstance = this.darcInstance ? this.darcInstance.iid.iid : null;
            v.credentialInstance = this.credentialInstance ? this.credentialInstance.iid.iid : null;
            v.coinInstance = this.coinInstance ? this.coinInstance.iid.iid : null;
        }
        return v;
    }

    get coinInstID(): Buffer {
        return Buffer.alloc(32);
    }

    /**
     * Returns a promise with the loaded Data in it, when available. If the file
     * is not found, it returns an empty data.
     */
    async load(): Promise<Data> {
        try {
            let str = await FileIO.readFile(Defaults.DataDir + "/" + dataFileName);
            if (str.length > 0) {
                let obj = JSON.parse(str);
                Log.print("setting values");
                await this.setValues(obj);
            }
            Log.print("connecting to ByzCoin");
            await this.connectByzcoin()
        } catch (e) {
            Log.catch(e);
        }
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(Defaults.DataDir + "/" + dataFileName, JSON.stringify(this.getValues()));
        return this;
    }

    qrcodeIdentity(): ImageSource {
        const text = JSON.stringify({
            pub_ed25519: this.keyIdentity.publicToHex(),
            usage: "identity",
            alias: this.alias,
        });
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: text,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }
}

/**
 * gData can be used as a global data in the app. However, when using it outside
 * of the UI, it is important to always pass the data, so that it is simpler to
 * test the libraries.
 */
export var gData = new Data();
