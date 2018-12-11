import {Socket} from "~/lib/network/NSNet";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";
import {Roster} from "~/lib/network/Roster";
import {WebSocket} from "~/lib/network/NSNet";
import {RequestPath} from "~/lib/network/RequestPath";

export class TestStore{
    constructor (public bcID: Buffer, public spawnerIID: InstanceID){}

    static async save(r: Roster, bcID: Buffer, spawnerIID: InstanceID){
        let s = new WebSocket(r.list[0].toWebsocket(""), RequestPath.PERSONHOOD);
        await s.send(RequestPath.PERSONHOOD_TESTSTORE, RequestPath.PERSONHOOD_TESTSTORE,{
            byzcoinid: bcID,
            spawneriid: spawnerIID.iid,
        });
    }

    static async load(r: Roster): Promise<TestStore>{
        let s = new WebSocket(r.list[0].toWebsocket(""), RequestPath.PERSONHOOD);
        let ts = await s.send(RequestPath.PERSONHOOD_TESTSTORE, RequestPath.PERSONHOOD_TESTSTORE,{});
        return new TestStore(ts.byzcoinid, ts.spawneriid);
    }
}