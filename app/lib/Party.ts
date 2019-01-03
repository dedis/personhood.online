import {Public} from "~/lib/KeyPair";
import {screen} from "tns-core-modules/platform";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();
import {Log} from "~/lib/Log";
import {PopDesc, PopPartyInstance, PopPartyStruct} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import * as Long from "long";

export class Party{
    isOrganizer: boolean = false;

    constructor(public partyInstance: PopPartyInstance){
    }

    qrcode(key: Public): ImageSource{
        let url="https://pop.dedis.ch/qrcode/party?public=" + key;
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: this.partyInstance.popPartyStruct.description.name,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }

    get state(): number{
        return this.partyInstance.popPartyStruct.state;
    }

    set state(s: number){
        this.partyInstance.popPartyStruct.state = s;
    }

    static fromDescription(name: string, purpose: string, location: string, date: Long): Party{
        let pd = new PopDesc(name, purpose, date, location);
        let pps = new PopPartyStruct(1, 1, null, pd, null, [],
            Long.fromNumber(0), null, null);
        let ppi = new PopPartyInstance(null, null, pps);
        return new Party(ppi);
    }
}