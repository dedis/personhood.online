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

export const dataFileName = "data.json";

/**
 * Data holds the data of the app.
 */
export class Data {
    _alias: string;
    _email: string;
    _continuousScan: boolean;
    _keyPersonhood: KeyPair;
    _keyIdentity: KeyPair;
    _byzcoin: any;

    /**
     * Constructs a new Data, optionally initialized with an object containing
     * fields for initialization of the class.
     * @param obj (optional) object with all fields for the class.
     */
    constructor(obj: any = {}) {
        this.setValues(obj);
    }

    setValues(obj: any) {
        this._alias = obj.alias ? obj.alias : "";
        this._email = obj.email ? obj.email : "";
        this._continuousScan = obj.continuousScan ? obj.continuousScan : false;
        this._keyPersonhood = obj.keyPersonhood ? new KeyPair(obj.keyPersonhood) : new KeyPair();
        this._keyIdentity = obj.keyIdentity ? new KeyPair(obj.keyIdentity) : new KeyPair();
    }

    async connectByzcoin(obj: any): Promise<any> {
        let byzcoinIDHex = Defaults.ByzCoinID;
        let socket: Socket;
        socket = new RosterSocket(Defaults.Roster, RequestPath.BYZCOIN);
        if (obj.byzcoinNode) {
            byzcoinIDHex = obj.byzcoinID;
            socket = new WebSocket(obj.byzcoinNode, RequestPath.BYZCOIN);
        }
        this._byzcoin = await new ByzCoinRPC(socket, Buffer.from(byzcoinIDHex, 'hex'));
        await this._byzcoin.updateConfig();
        return this._byzcoin;
    }

    getValues(): any {
        return {
            alias: this._alias,
            email: this._email,
            continuousScan: this._continuousScan,
            keyPersonhood: this._keyPersonhood.privateToHex(),
            keyIdentity: this._keyIdentity.privateToHex(),
        };
    }

    get coinInstID(): Buffer {
        return new Buffer(32);
    }

    /**
     * Returns a promise with the loaded Data in it, when available. If the file
     * is not found, it returns an empty data.
     */
    async load(): Promise<Data> {
        try {
            let str = await FileIO.readFile(dataFileName);
            let obj = JSON.parse(str);
            this.setValues(obj);
            await this.connectByzcoin(obj)
        } catch (e) {
            Log.catch(e);
        }
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(dataFileName, JSON.stringify(this.getValues()));
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

    /**
     * Getters and setters.
     */

    get alias(): string {
        return this._alias;
    }

    set alias(a: string) {
        this._alias = a;
    }

    get email(): string {
        return this._email;
    }

    set email(e: string) {
        this._email = e;
    }

    get continuousScan(): boolean {
        return this._continuousScan;
    }

    set coninuousScan(c: boolean) {
        this._continuousScan = c;
    }

    get keyPersonhood(): KeyPair {
        return this._keyPersonhood;
    }

    set keyPersonhood(kp: KeyPair) {
        this._keyPersonhood = kp;
    }

    get keyIdentity(): KeyPair {
        return this._keyIdentity;
    }

    set keyIdentity(kp: KeyPair) {
        this._keyIdentity = kp;
    }
}

/**
 * gData can be used as a global data in the app. However, when using it outside
 * of the UI, it is important to always pass the data, so that it is simpler to
 * test the libraries.
 */
export var gData = new Data();
