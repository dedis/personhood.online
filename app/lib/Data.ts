/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {FileIO} from "~/lib/FileIO";
import Log from "~/lib/Log";
import {KeyPair} from "~/lib/KeyPair";

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

    getValues(): any {
        return {
            alias: this._alias,
            email: this._email,
            continuousScan: this._continuousScan,
            keyPersonhood: this._keyPersonhood.privateToHex(),
            keyIdentity: this._keyIdentity.privateToHex(),
        };
    }

    /**
     * Returns a promise with the loaded Data in it, when available. If the file
     * is not found, it returns an empty data.
     */
    async load(): Promise<Data> {
        try {
            let str = await FileIO.readFile(dataFileName);
            this.setValues(JSON.parse(str));
        } catch (e) {
            Log.catch(e);
        }
        return this;
    }

    async save(): Promise<Data> {
        await FileIO.writeFile(dataFileName, JSON.stringify(this.getValues()));
        return this;
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
