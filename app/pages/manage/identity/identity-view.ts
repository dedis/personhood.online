import {Observable} from "tns-core-modules/data/observable";
import {Data, gData} from "~/lib/Data";
import {ServerIdentity} from "~/lib/network/Roster";
import {WebSocket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {DecodeType} from "~/lib/network/DecodeType";
import {Log} from "~/lib/Log";
import {adminView} from "~/pages/settings/settings-page";
import {ObservableArray} from "tns-core-modules/data/observable-array";

export class IdentityViewModel extends Observable {

    constructor(d: Data) {
        super();
        this.userId = new Identity(d.alias, d.email, d.personhoodPublished);
    }

    set userId(value: Identity) {
        this.set("_admin", value);
    }

    get userId(): Identity {
        return this.get("_admin");
    }
}

export class Identity {
    constructor(public alias: string, public email:string,
                public publishPersonhood: boolean) {
    }
}
