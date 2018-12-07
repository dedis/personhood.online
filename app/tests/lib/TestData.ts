// import {Data} from "~/lib/Data";
// import {KeyPair} from "~/lib/KeyPair";
// import {Log} from "~/lib/Log";
// import {Defaults} from "~/lib/Defaults";
// import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
//
// describe("Initializing Data", () => {
//     it("Must start with empty values", () => {
//         let d = new Data();
//         expect(d.alias).toBe("");
//         expect(d.email).toBe("");
//         expect(d.continuousScan).toBe(false);
//         expect(d.keyIdentity).not.toBe(null);
//         expect(d.keyPersonhood).not.toBe(null);
//     });
// });
//
// describe("saves and loads", () => {
//     it("Must keep data", async () => {
//         let keyI = new KeyPair();
//         let keyP = new KeyPair();
//         let dataObj = {
//             alias: "alias",
//             email: "email@email.com",
//             continuousScan: true,
//             keyIdentity: keyI,
//             keyPersonhood: keyP,
//         };
//         let d = new Data(dataObj);
//         let d2 = new Data();
//         expect(d2.getValues()).not.toEqual(d.getValues());
//         await d2.load();
//         expect(d2.getValues()).not.toEqual(d.getValues());
//         await d.save();
//         await d2.load();
//         expect(d2.getValues()).toEqual(d.getValues());
//     })
// });
//
// xdescribe("connects to local byzcoin", () => {
//     it("Must ping byzcoin", async () => {
//         let d = new Data({});
//         let bc = await d.connectByzcoin({});
//         Log.print(bc.roster);
//     })
// });
//
// describe("setup byzcoin and create party", () => {
//     it("Must create byzcoin", async () => {
//         // Creating a new ledger
//         Log.print("creating new ledger");
//         let bc = await ByzCoinRPC.newLedger(Defaults.Roster);
//         Log.print("Getting config");
//         await bc.updateConfig();
//         Log.print("verifying Interval");
//         expect(bc.config.blockinterval).toBe(1e9);
//
//         // Setting up organizer1
//         let dataOrg1 = new Data({alias: "org1"});
//         // Approving organizer1 by sending 10MCoins to the account
//         await bc.mintCoins(dataOrg1.coinInstID, 1e7);
//     });
// });
