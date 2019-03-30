require("nativescript-nodeify");

import {randomBytes} from "crypto-browserify";
import {curve, Point} from "@dedis/kyber";
import {Buffer} from "buffer";
import {Log} from "~/lib/Log";

const Curve25519 = curve.newCurve("edwards25519");

/**
 * KeyPair holds the private and public key that go together. It has
 * convenience methods to initialize and print the private and public
 * key.
 */
export class KeyPair {
    _private: Private;
    _public: Public;

    constructor(privHex: string = "") {
        if (privHex && privHex.length == 64) {
            this.setPrivateHex(privHex);
        } else {
            this.randomize();
        }
    }

    setPrivateHex(privHex: string) {
        this.setPrivate(Private.fromHex(privHex));
    }

    setPrivate(priv: Private) {
        this._private = priv;
        this._public = new Public(Curve25519.point().mul(this._private.scalar, null));
    }

    randomize() {
        this.setPrivate(Private.fromRand());
    }

    toObject(): any{
        return {
            pub: this._public.toBuffer(),
            priv: this._private.toBuffer(),
        }
    }

    static fromBuffer(priv: any): KeyPair {
        return new KeyPair(Buffer.from(priv).toString('hex'));
    }

    static fromObject(obj: any){
        return new KeyPair(Private.fromBuffer(obj.priv).toHex());
    }
}

export class Private {
    constructor(public scalar: any) {
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    toBuffer(): Buffer {
        return Buffer.from(this.scalar.marshalBinary());
    }

    equal(p: Private): boolean {
        return this.scalar.equal(p.scalar);
    }

    add(p: Private): Private {
        return new Private(Curve25519.scalar().add(this.scalar, p.scalar));
    }

    static fromBuffer(buf: Buffer): Private {
        let p = Curve25519.scalar();
        p.unmarshalBinary(buf);
        return new Private(p);
    }

    static fromHex(hex: string): Private {
        return Private.fromBuffer(Buffer.from(hex, 'hex'));
    }

    static zero(): Private {
        let p = Curve25519.scalar();
        p.zero();
        return new Private(p);
    }

    static one(): Private {
        let p = Curve25519.scalar();
        p.one();
        return new Private(p);
    }

    static fromRand(): Private {
        return new Private(Curve25519.scalar().setBytes(randomBytes(32)));
    }
}

export class Public {
    constructor(public point: Point) {
    }

    equal(p: Public): boolean {
        return this.point.equals(p.point);
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

    toBuffer(): Buffer {
        return Buffer.from(this.point.marshalBinary());
    }

    mul(s: Private): Public{
        let ret = Curve25519.point();
        ret.mul(s.scalar, this.point);
        return new Public(ret);
    }

    add(p: Public): Public{
        return new Public(Curve25519.point().add(this.point, p.point));
    }

    static base(): Public {
        let p = Curve25519.point();
        p.base();
        return new Public(p);
    }

    static fromBuffer(buf: Buffer): Public {
        let p = Curve25519.point();
        p.unmarshalBinary(buf);
        return new Public(p);
    }

    static fromHex(hex: string): Public {
        return Public.fromBuffer(Buffer.from(hex, 'hex'));
    }

    static zero(): Public {
        let p = Curve25519.point();
        p.null();
        return new Public(p);
    }

    static fromRand(): Public {
        let kp = new KeyPair();
        return kp._public;
    }
}