import * as Long from "long";

import {CreateByzCoin} from "~/lib/Data";

describe("Testing personhood party", async () => {
    let cbc: CreateByzCoin;

    beforeAll(async () => {
        cbc = await CreateByzCoin.start();
    });

    describe("be able to start a party", () => {
        it("creates two organizers and one registered attendee", async () => {
            let org1 = await cbc.addUser('org1', Long.fromNumber(1e7));
            let org2 = await cbc.addUser('org2');
            let attendee = await cbc.addUser('att1');

            cbc.spawner.createCoin()
        })
        it("creates two organizers and one unregistered attendee", async () => {
            let org1 = await cbc.addUser('org1', Long.fromNumber(1e7));
            let org2 = await cbc.addUser('org2');
            // let attendee = await cbc.addUser('att1');
        })
    })
});