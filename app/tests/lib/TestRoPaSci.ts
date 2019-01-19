import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";

fdescribe("Rock Paper Scissors Test", () => {
    fdescribe("Rock Paper Scissors", async () => {
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

            let rps1 = await spw.createRoPaSci(player1.coinInstance, player1.keyIdentitySigner, Long.fromNumber(100),
                0, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            await expectAsync(rps1.confirm(0, Buffer.alloc(31).fill(1), player1.coinInstance)).toBeRejected();
            await rps1.confirm(0, Buffer.alloc(31), player1.coinInstance);

            Log.lvl2("Verifying coins - player 1 lost");
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);
            coins2 += 200;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
        });

        it("gives coins to player 2", async () => {
            Log.lvl1("Let player 1 win");
            let spw = tdAdmin.d.spawnerInstance;
            let coins1 = (await player1.coinInstance.update()).coin.value.toNumber();
            let coins2 = (await player2.coinInstance.update()).coin.value.toNumber();

            let rps1 = await spw.createRoPaSci(player1.coinInstance, player1.keyIdentitySigner, Long.fromNumber(100),
                2, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            await expectAsync(rps1.confirm(2, Buffer.alloc(31).fill(1), player1.coinInstance)).toBeRejected();
            await rps1.confirm(2, Buffer.alloc(31), player1.coinInstance);

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

            let rps1 = await spw.createRoPaSci(player1.coinInstance, player1.keyIdentitySigner, Long.fromNumber(100),
                1, Buffer.alloc(31));
            coins1 -= 100 + spw.spawner.costRoPaSci.value.toNumber();
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);

            Log.lvl2("2nd player plays, then plays again and is rejected");
            await rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1);
            coins2 -= 100;
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
            await expectAsync(rps1.second(player2.coinInstance, player2.keyIdentitySigner, 1)).toBeRejected();

            Log.lvl2("1st player plays again with wrong hash, then with correct hash");
            await expectAsync(rps1.confirm(2, Buffer.alloc(31).fill(1), player1.coinInstance)).toBeRejected();
            await rps1.confirm(1, Buffer.alloc(31), player1.coinInstance);

            Log.lvl2("Verifying coins - draw");
            expect((await player1.coinInstance.update()).coin.value.toNumber()).toBe(coins1);
            expect((await player2.coinInstance.update()).coin.value.toNumber()).toBe(coins2);
        });
    });
});