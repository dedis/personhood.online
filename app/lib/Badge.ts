import {Party} from "~/lib/Party";
import {KeyPair} from "~/lib/KeyPair";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
import {screen} from "tns-core-modules/platform";
const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();

export class Badge{
    constructor(public party: Party, public keypair: KeyPair){}

    get qrcode(): ImageSource{
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: this.party.name,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }
}