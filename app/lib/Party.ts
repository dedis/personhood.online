import {Public} from "~/lib/KeyPair";
import {screen} from "tns-core-modules/platform";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();
import {Log} from "~/lib/Log";

export class Party{
    // state of the party:
    // 0 - before barrier
    // 1 - scanning in progress (after barrier)
    // 2 - finalized
    state: number;
    isOrganizer: boolean;

    constructor(public name: string, public desc: string, public date: string, public location: string,
                public attendees: Public[]){
        this.state = 0;
        this.isOrganizer = false;
    }

    qrcode(key: Public): ImageSource{
        let url="https://pop.dedis.ch/qrcode/party?public=" + key
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: this.name,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }
}

export class PartyStruct{

}