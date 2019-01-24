import {Log} from "~/lib/Log";
import {Data, TestData} from "~/lib/Data";
import * as Long from "long";
import {RoPaSciInstance} from "~/lib/cothority/byzcoin/contracts/RoPaSciInstance";
import {PersonhoodRPC} from "~/lib/PersonhoodRPC";
import {PopDesc, PopPartyInstance} from "~/lib/cothority/byzcoin/contracts/PopPartyInstance";
import {Party} from "~/lib/Party";

fdescribe("Rock Paper Scissors Test", () => {
    fdescribe("Rock Paper Scissors", async () => {
        let tdAdmin: TestData;
        let player1: Data;
        let player2: Data;
        let player3: Data;
        let party: Party;

        beforeAll(async () => {
            Log.lvl1("Trying to load previous byzcoin");
            player1 = new Data("player1");
            player1.setFileName("data1.json");

            player2 = new Data("player2");
            player2.setFileName("data2.json");

            player3 = new Data("player3");
            player3.setFileName("data3.json");

            await player1.load();
            if (player1.parties.length > 0){
                Log.lvl1("Probably found an existing byzcoin - using this one to speed up tests");
                await player2.load();
                await player3.load();
                player1.polls = [];
                player2.polls = [];
                player3.polls = [];
                let rhp = new PersonhoodRPC(player1.bc);
                await rhp.pollWipe();
                party = player1.parties[0];
                return;
            } else {
                player1.bc = null;
            }

            Log.lvl1("Creating Byzcoin");
            tdAdmin = await TestData.init(new Data());
            await tdAdmin.createAll('admin');

            await player1.connectByzcoin();
            await tdAdmin.d.registerContact(player1.contact, Long.fromNumber(1e6));
            await player1.verifyRegistration();

            await player2.connectByzcoin();
            await tdAdmin.d.registerContact(player2.contact, Long.fromNumber(1e6));
            await player2.verifyRegistration();

            await player3.connectByzcoin();
            await tdAdmin.d.registerContact(player3.contact, Long.fromNumber(1e6));
            await player3.verifyRegistration();

            await player1.publishPersonhood(true);
            await player2.publishPersonhood(true);
            let pdesc = new PopDesc("test", "testing", Long.fromNumber(0), "here");
            let partyInst = await tdAdmin.cbc.spawner.createPopParty(tdAdmin.d.coinInstance,
                [tdAdmin.d.keyIdentitySigner], [player1.contact], pdesc, Long.fromNumber(1000));
            party = new Party(partyInst);
            await player1.addParty(party);
            await partyInst.activateBarrier(player1.keyIdentitySigner);
            await partyInst.addAttendee(player2.keyPersonhood._public);
            await partyInst.finalize(player1.keyIdentitySigner);
        });

        afterEach(() => {
            Log.print("this line will be overwritten");
        });

        it("must be saved and loaded", async () => {
            let poll1 = await player1.addPoll(party.partyInstance.iid, "test", "for testing",
                ["one", "two", "three"]);
            let player1bis = new Data("player1bis");
            player1bis.setFileName("data1.json");
            await player1bis.load();
            expect(player1bis.polls.length).toBe(1);
            expect(player1bis.polls[0].toObject()).toEqual(poll1.toObject());
        });

        it("must retrieve poll and be able to chose", async () => {
            Log.lvl1("testing that polls correctly get picked up by the next player");
            let phrpc = new PersonhoodRPC(player1.bc);
            let badges = player1.badges.map(b => b.party.partyInstance.iid);
            expect((await phrpc.pollList(badges)).length).toBe(0);
            let poll1 = await player1.addPoll(party.partyInstance.iid, "test", "for testing",
                ["one", "two", "three"]);
            expect((await phrpc.pollList(badges)).length).toBe(1);
            expect(player2.polls.length).toBe(0);
            await player2.reloadPolls();
            expect(player2.polls.length).toBe(1);

            Log.lvl1("first chose wrong answer, then chose right answer");
            await expectAsync(phrpc.pollAnswer(player2.keyPersonhood._private, party, poll1.pollID, 3)).toBeRejected();
            await phrpc.pollAnswer(player2.keyPersonhood._private, party, poll1.pollID, 0);

            Log.lvl1("let unknown person chose an answer");
            await expectAsync(phrpc.pollAnswer(player3.keyPersonhood._private, party, poll1.pollID, 1)).toBeRejected();

            Log.lvl1("make sure the choices get picked up by everybody");
            let polls = await player1.reloadPolls();
            expect(polls[0].choices.length).toBe(1);
            polls = await player2.reloadPolls();
            expect(polls[0].choices.length).toBe(1);
        });
    });
});