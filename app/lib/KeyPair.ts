require("nativescript-nodeify");
import {Buffer} from "buffer";
const Kyber = require("@dedis/kyber-js");
const Curve25519 = new Kyber.curve.edwards25519.Curve;

/**
 * KeyPair holds the private and public key that go together. It has
 * convenience methods to initialize and print the private and public
 * key.
 */
export class KeyPair{
    _private: any;
    _public: any;

    constructor(privHex: string = ""){
        if (privHex.length == 64){
            this.setPrivate(privHex);
        } else {
            this.randomize();
        }
    }

    setPrivate(privHex: string){
        let priv = Curve25519.scalar();
        priv.unmarshalBinary(Buffer.from(privHex, "hex"));
        this._private = priv;
        this._public = Curve25519.point().mul(this._private, null);
    }

    randomize(){
        this.setPrivate(Curve25519.newKey());
    }

    privateToHex(): string{
        return new Buffer(this._private.marshalBinary()).toString("hex");
    }

    publicToHex(): string{
        return new Buffer(this._public.marshalBinary()).toString("hex");
    }
}