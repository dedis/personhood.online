require("nativescript-nodeify");
const Kyber = require("@dedis/kyber-js");
const Curve25519 = new Kyber.curve.edwards25519.Curve;
import {Buffer} from "buffer";
import {Log} from "~/lib/Log";

/**
 * KeyPair holds the private and public key that go together. It has
 * convenience methods to initialize and print the private and public
 * key.
 */
export class KeyPair {
    _private: any;
    _public: any;

    constructor(privHex: string = "") {
        if (privHex && privHex.length == 64) {
            this.setPrivateHex(privHex);
        } else {
            this.randomize();
        }
    }

    setPrivateHex(privHex: string) {
        let priv = Curve25519.scalar();
        priv.unmarshalBinary(new Uint8Array(Buffer.from(privHex, "hex")));
        this.setPrivate(priv);
    }

    setPrivate(priv: any) {
        this._private = priv;
        this._public = Curve25519.point().mul(this._private, null);
    }

    randomize() {
        this.setPrivate(Curve25519.newKey());
    }

    privateToHex(): string {
        return new Buffer(this._private.marshalBinary()).toString("hex");
    }

    publicToHex(): string {
        return new Buffer(this._public.marshalBinary()).toString("hex");
    }
}

export class Private{}

export class Public{
    static fromBuffer(buf: Buffer): any{
        let p = Curve25519.point();
        p.unmarshalBinary(new Uint8Array(buf));
        return p;
    }

    static fromHex(hex: string): any{
        return Public.fromBuffer(Buffer.from(hex, 'hex'));
    }

    static zero(): any{
        let p = Curve25519.point();
        p.null();
        return p;
    }
}