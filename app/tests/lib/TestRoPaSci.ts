import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {PersonhoodRPC} from "~/lib/PersonhoodRPC";

describe("Rock Paper Scissors Test", () => {
    describe("Rock Paper Scissors", async () => {
        let tdAdmin: TestData;
        let player1: Data;
        let player2: Data;

        beforeAll(async () => {
            Log.lvl1("Creating Byzcoin");
            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');
            player1 = new Data("player1");
            await player1.connectByzcoin();
            await tdAdmin.d.registerContact(player1.contact, Long.fromNumber(1e6));
            await player1.verifyRegistration();
            player2 = new Data("player2");
            await player2.connectByzcoin();
            await tdAdmin.d.registerContact(player2.contact, Long.fromNumber(1e6));
            await player2.verifyRegistration();
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("gives coins to player 2", async () => {
            Log.lvl1("Let player 2 win");
            let spw = tdAdmin.d.spawnerInstance;
            let coins1 = (await player1.coinInstance.update()).coin.value.toNumber();
            let coins2 = (await player2.coinInstance.update()).coin.value.toNumber();

            let rps1 = await spw.createRoPaSci("p2 wins", player1.coinInstance, player1.keyIdentitySigner,
                Long.fromNumber(100), 0, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            rps1.firstMove = 1;
            await expectAsync(rps1.reveal(player1.coinInstance)).toBeRejected();
            rps1.firstMove = 0;
            await rps1.reveal(player1.coinInstance);

            Log.lvl2("Verifying coins - player 1 lost");
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);
            coins2 += 200;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
        });

        it("gives coins to player 1", async () => {
            Log.lvl1("Let player 1 win");
            let spw = tdAdmin.d.spawnerInstance;
            let coins1 = (await player1.coinInstance.update()).coin.value.toNumber();
            let coins2 = (await player2.coinInstance.update()).coin.value.toNumber();

            let rps1 = await spw.createRoPaSci("p1 wins", player1.coinInstance, player1.keyIdentitySigner,
                Long.fromNumber(100), 2, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            rps1.firstMove = 0;
            await expectAsync(rps1.reveal(player1.coinInstance)).toBeRejected();
            rps1.firstMove = 2;
            await rps1.reveal(player1.coinInstance);

            Log.lvl2("Verifying coins - player 2 lost");
            coins1 += 200;
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
        });

        it("calculates a draw", async () => {
            Log.lvl1("Nobody wins");
            let spw = tdAdmin.d.spawnerInstance;
            let coins1 = (await player1.coinInstance.update()).coin.value.toNumber();
            let coins2 = (await player2.coinInstance.update()).coin.value.toNumber();

            let rps1 = await spw.createRoPaSci("draw", player1.coinInstance, player1.keyIdentitySigner,
                Long.fromNumber(100), 1, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            rps1.firstMove = 2;
            await expectAsync(rps1.reveal(player1.coinInstance)).toBeRejected();
            rps1.firstMove = 1;
            await rps1.reveal(player1.coinInstance);

            Log.lvl2("Verifying coins - draw");
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
        });

        it("stores in service", async () => {
            Log.lvl1("Save and retrieve rps from service");
            let spw = tdAdmin.d.spawnerInstance;

            let rps1 = await spw.createRoPaSci("service", player1.coinInstance, player1.keyIdentitySigner,
                Long.fromNumber(100), 0, Buffer.alloc(31));
            await player1.addRoPaSci(rps1);

            Log.lvl2("2nd player plays");
            await player2.reloadRoPaScis();
            let rps2 = player2.ropascis.slice(-1)[0];
            await rps2.second(player2.coinInstance, player2.keyIdentitySigner, 1);

            Log.lvl2("1st player updates and then plays");
            await player1.updateRoPaScis();
            expect(rps1.roPaSciStruct.secondPlayer).toBe(1);
            await rps1.reveal(player1.coinInstance);

            Log.lvl2("Verifying updated games");
            await player1.updateRoPaScis();
            await player2.updateRoPaScis();
            expect(rps1.isDone).toBeTruthy();
            expect(rps2.isDone).toBeTruthy();
        });

        fit("stores on disk", async () => {
            Log.lvl1("Save and retrieve rps from disk");
            let spw = tdAdmin.d.spawnerInstance;
            await new PersonhoodRPC(spw.bc).wipeRPS();

            Log.lvl2("handling fresh ropasci");
            let rps1 = await spw.createRoPaSci("service", player1.coinInstance, player1.keyIdentitySigner,
                Long.fromNumber(100), 0, Buffer.alloc(31));
            await player1.addRoPaSci(rps1);

            let obj1 = rps1.toObject();
            let str1 = JSON.stringify(obj1);
            let obj2 = JSON.parse(str1);
            let rps2 = RoPaSciInstance.fromObject(spw.bc, obj2);
            expect(rps2.toObject()).toEqual(obj1);
            expect(rps2.firstMove).toEqual(rps1.firstMove);
            expect(rps2.fillUp).toEqual(rps1.fillUp);

            await player1.save();

            let player2 = new Data();
            await player2.load();
            expect(player2.ropascis.length).toBe(1);
            expect(player2.ropascis[0].toObject()).toEqual(obj1);

            await player2.updateRoPaScis();
            expect(player2.ropascis.length).toBe(1);
            expect(player2.ropascis[0].toObject()).toEqual(obj1);

            await player2.reloadRoPaScis();
            expect(player2.ropascis.length).toBe(1);
            expect(player2.ropascis[0].toObject()).toEqual(obj1);

            Log.lvl2("handling played ropasci");
            await player2.ropascis[0].second(player2.coinInstance, player2.keyIdentitySigner, 2);
            Log.print(player2.ropascis[0].data);
            await player2.save();
            await player2.load();
            Log.print(player2.ropascis[0].data);
            Log.print(rps1.data);
            expect(player2.ropascis.length).toBe(1);
            rps2 = player2.ropascis[0];
            expect(rps2.roPaSciStruct.secondPlayer).toBe(2);
            expect(rps2.toObject()).not.toEqual(obj1);
        });
    });
});