import {Observable} from "tns-core-modules/data/observable";
import {Data} from "~/lib/Data";
import {ServerIdentity} from "~/lib/network/Roster";
import {WebSocket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";
import {DecodeType} from "~/lib/network/DecodeType";
import {Log} from "~/lib/Log";
import {adminView} from "~/pages/settings/settings-page";
import {ObservableArray} from "tns-core-modules/data/observable-array";

export class AdminViewModel extends Observable {
    nodes:ObservableArray<Node> = new ObservableArray();

    constructor(d: Data) {
        super();
        this.admin = new Admin(d.alias, d.email, d.continuousScan, d.personhoodPublished);
        d.bc.config.roster.list.forEach(si => this.nodes.push(new Node(si)));
    }

    set admin(value: Admin) {
        this.set("_admin", value);
    }

    get admin(): Admin {
        return this.get("_admin");
    }
}

export class Admin {
    constructor(public alias: string, public email:string,
                public continuousScan: boolean, public publishPersonhood: boolean) {
    }
}

export class Node {
    address: string;
    status: string;

    constructor(si: ServerIdentity) {
        this.address = si.address;
        this.status = "unknown";

        let s = new WebSocket(si.toWebsocket(""), RequestPath.STATUS);
        Log.print("getting status of", si.address);
        s.send(RequestPath.STATUS_REQUEST, DecodeType.STATUS_RESPONSE, {})
            .then(response =>{
                this.status = response.serveridentity.description + ": OK";
                adminView.nodes.splice(0, 0);
            })
            .catch(err =>{
                this.status = "Error: " + err;
                adminView.nodes.splice(0, 0);
            })
    }
}