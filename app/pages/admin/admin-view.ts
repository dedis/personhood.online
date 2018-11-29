import { Observable } from "tns-core-modules/data/observable";
import {Data} from "~/lib/Data";

export class AdminViewModel extends Observable {
    constructor(d: Data) {
        super();
        this.admin = new Admin(d.alias, d.email, d.continuousScan);
    }

    set admin(value: Admin) {
        this.set("_admin", value);
    }

    get admin(): Admin {
        return this.get("_admin");
    }
}

export class Admin {
    public alias: string;
    public email: string;
    public continuousScan: boolean;

    constructor(alias, email, continuousScan) {
        this.alias = alias;
        this.email = email;
        this.continuousScan = continuousScan;
    }
}