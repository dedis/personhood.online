import {Party} from "~/lib/Party";
import {KeyPair} from "~/lib/KeyPair";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {screen} from "tns-core-modules/platform";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Data} from "~/lib/Data";
const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

export class Badge{
    public mined: boolean = false;
    constructor(public party: Party, public keypair: KeyPair){}

    toObject(): any{
        return {
            party: this.party.toObject(),
            keypair: this.keypair.toObject(),
            mined: this.mined,
        }
    }

    async mine(d: Data, setProgress: Function = null){
        this.mined = true;
        return this.party.partyInstance.mineFromData(d, setProgress);
    }

    get qrcode(): ImageSource{
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: this.party.partyInstance.popPartyStruct.description.name,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }

    static fromObject(bc: ByzCoinRPC, obj: any): Badge{
        let p = Party.fromObject(bc, obj.party);
        let kp = KeyPair.fromObject(obj.keypair);
        let b = new Badge(p, kp);
        b.mined = obj.mined;
        return b;
    }
}