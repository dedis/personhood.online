import {Public} from "~/lib/KeyPair";
import {screen} from "tns-core-modules/platform";
import {fromNativeSource, ImageSource} from "tns-core-modules/image-source";
const ZXing = require("nativescript-zxing");
const QRGenerator = new ZXing();
import {Log} from "~/lib/Log";
import {PopDesc, PopPartyInstance, PopPartyStruct} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import * as Long from "long";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {DarcInstance} from "~/lib/cothority/byzcoin/contracts/DarcInstance";

export class Party{
    static readonly PreBarrier = 1;
    static readonly Scanning = 2;
    static readonly Finalized = 3;
    static readonly url = "https://pop.dedis.ch/qrcode/party";
    isOrganizer: boolean = false;

    constructor(public partyInstance: PopPartyInstance){
    }

    qrcode(key: Public): ImageSource{
        let url=Party.url + "?public=" + key.toHex();
        url += "&name=" + this.partyInstance.popPartyStruct.description.name;
        const sideLength = screen.mainScreen.widthPixels / 4;
        const qrcode = QRGenerator.createBarcode({
            encode: url,
            format: ZXing.QR_CODE,
            height: sideLength,
            width: sideLength
        });
        return fromNativeSource(qrcode);
    }

    toObject(): any{
        return {
            party: this.partyInstance.toObject(),
            isOrganizer: this.isOrganizer,
        }
    }

    get state(): number{
        return this.partyInstance.popPartyStruct.state;
    }

    set state(s: number){
        this.partyInstance.popPartyStruct.state = s;
    }

    static fromObject(bc: ByzCoinRPC, obj: any) : Party{
        let p = new Party(PopPartyInstance.fromObject(bc, obj.party));
        p.isOrganizer = obj.isOrganizer;
        return p;
    }

    static fromDescription(name: string, purpose: string, location: string, date: Long): Party{
        let pd = new PopDesc(name, purpose, date, location);
        let pps = new PopPartyStruct(1, 1, null, pd, null, [],
            Long.fromNumber(0), null, null);
        let ppi = new PopPartyInstance(null, null);
        ppi.popPartyStruct =  pps;
        return new Party(ppi);
    }
}