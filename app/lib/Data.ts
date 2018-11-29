/**
 * This is the main library for storing and getting things from the phone's file
 * system.
 */
import {FileIO} from "~/lib/FileIO";
import Log from "~/lib/Log";
import {KeyPair} from "~/lib/KeyPair";

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
        if (Object.keys(obj).length > 0) {
            this._alias = obj.alias;
            this._email = obj.email;
            this._continuousScan = obj.continuousScan;
            this._keyPersonhood = new KeyPair(obj.keyPersonhood);
            this._keyIdentity = new KeyPair(obj.keyIdentity);
        }
    }

    /**
     * Returns a promise with the loaded Data in it, when available. If the file
     * is not found, it returns an empty data.
     */
    static load(): Promise<Data> {
        return FileIO.readFile("data.json")
            .then((str) => {
                let d = JSON.parse(str);
                return new Data(JSON.parse(str));
            })
            .catch((err) => {
                Log.catch(err);
                return new Data();
            })
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
export var gData: Data;
export var loaded = false;

Data.load().then(d => {
    Log.print("Data loaded");
    gData = d;
    loaded = true;
});
