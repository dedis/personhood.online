import {Roster} from "~/lib/network/Roster";
import {FileIO} from "~/lib/FileIO";

const Buffer = require("buffer/").Buffer;

export var Defaults = {
    DataDir: "storage",
    // Standard Roster for the app
    RosterTOMLDEDIS: `
[[servers]]
  Address = "tls://pop.dedis.ch:7772"
  Suite = "Ed25519"
  Public = "057923aabaad24d9a5cf75c1c0d257e84e99ba5fd29db541432e4a1914af9ad2"
  Description = "Conode_1"
[[servers]]
  Address = "tls://pop.dedis.ch:7774"
  Suite = "Ed25519"
  Public = "da6e0f39da50185fce5656426adcf4e5bad3c27c1f5182f6ae1006c87173b7c9"
  Description = "Conode_2"
[[servers]]
  Address = "tls://pop.dedis.ch:7776"
  Suite = "Ed25519"
  Public = "82961f12d49af09492a44929a88c5e7fb6746c4599a59a99e298e7d3c526746c"
  Description = "Conode_3"
[[servers]]
  Address = "tls://pop.dedis.ch:7778"
  Suite = "Ed25519"
  Public = "1365232c84fb92f66bc003bff0bfb22250a99d6f3cecad4d6c53a64481486e93"
  Description = "Conode_4"
`,
    RosterTOMLLOCAL: `
[[servers]]
  Address = "tls://192.168.0.1:7778"
  Suite = "Ed25519"
  Public = "a4c56e09a80f57de900a4d0f7f4b6e9726ba7bc2c9cfd3d226c21d67bc27327b"
  Description = "Conode_4"
[[servers]]
  Address = "tls://192.168.0.1:7776"
  Suite = "Ed25519"
  Public = "db3bd39be36ee3cfa2bb9d92f618bb130da73e1db9116182382622f2aea205a3"
  Description = "Conode_3"
[[servers]]
  Address = "tls://192.168.0.1:7774"
  Suite = "Ed25519"
  Public = "28059f531561393a5690b3ef52d06b72970fd31e817ffdbff86040b624ebeed9"
  Description = "Conode_2"
[[servers]]
  Address = "tls://192.168.0.1:7772"
  Suite = "Ed25519"
  Public = "c586906aaa278ab97bf7490ca45cdf9e8021220e9ad9ba979b41cc2837a5b0b1"
  Description = "Conode_1"
`,
    Roster: null,
    // ByzCoinID
    ByzCoinID: Buffer.from("aaa5b2db9523c5c66eedac22d878bc3d718d19f60d944004a53a9b977ed88ba3", 'hex'),
    // SpawnerID is the instance the app can contact to create new instances. Because of circular dependencies, this
    // cannot be an InstanceID.
    SpawnerIID: Buffer.from("7dc459097579d6ce91f9a6c4ca3f4af6215036cc1e0e7d1dcf80e9c940b7e6a7", 'hex'),
    // SpawnerIID: null,

    // - Testing settings - all settings here are set for the non-testing case. If testing == true, then the
    // settings should be set in the below 'if'. This ensures that we don't forget any testing setting.

    // Testing
    Testing: false,
    // If Confirm is false, there are no security confirmations asked. This is for
    // easier UI testing.
    Confirm: true,
    // pre-loads polling stats for UI testing
    PollPrechoice: false,
    // Redirect pop.dedis.ch to another (local) IP
    NetRedirect: null,
    // Alias can be set to a non-"" value to have a default alias
    Alias: "",
    // TestButtons allow to delete everything
    TestButtons: false,
    // DataFile can be set to a string that will be used to overwrite the Data
    DataFile: null,
    // LoadTestStore
    LoadTestStore: false,
};

if (Defaults.Testing) {
    Defaults.Roster = Roster.fromTOML(Defaults.RosterTOMLLOCAL);
    // Defaults.Roster = Roster.fromTOML(Defaults.RosterTOMLDEDIS);
    // Defaults.NetRedirect = ["pop.dedis.ch", "192.168.0.1"];
    Defaults.Confirm = false;
    Defaults.TestButtons = true;
    Defaults.Alias = "testing";
    Defaults.LoadTestStore = true;
    // Defaults.Testing = false;
    // Defaults.LoadTestStore = true;
    // Defaults.DataFile = `{"alias":"org1","email":"","continuousScan":false,"personhoodPublished":false,"keyPersonhood":"9dcc44eb5a32451f6d0edba63ac9d849834fde15b27ef6a4f318b1b0cfe27901","keyIdentity":"0d5ad5ed78e6ef4dab9293310c4c8ea55dcd3bc35ae1c0f447fa0a8092709503","friends":[],"bcRoster":{"id":[151,195,72,202,74,214,92,203,166,112,171,211,214,119,158,152],"list":[{"public":{"type":"Buffer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"id":[56,9,227,121,117,164,91,74,134,88,153,102,141,100,93,149],"address":"tls://192.168.0.1:7778","description":"Conode_4"},{"public":{"type":"Buffer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"id":[56,9,227,121,117,164,91,74,134,88,153,102,141,100,93,149],"address":"tls://192.168.0.1:7776","description":"Conode_3"},{"public":{"type":"Buffer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"id":[56,9,227,121,117,164,91,74,134,88,153,102,141,100,93,149],"address":"tls://192.168.0.1:7774","description":"Conode_2"},{"public":{"type":"Buffer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"id":[56,9,227,121,117,164,91,74,134,88,153,102,141,100,93,149],"address":"tls://192.168.0.1:7772","description":"Conode_1"}],"aggregate":{"type":"Buffer","data":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},"bcID":{"type":"Buffer","data":[112,137,67,235,4,85,107,84,89,252,28,242,254,245,3,170,74,201,111,206,99,32,21,22,29,182,67,193,52,193,105,190]},"darcInstance":{"type":"Buffer","data":[18,160,61,96,140,11,138,101,86,169,196,113,220,249,102,49,70,67,202,85,236,127,134,53,136,198,95,207,29,76,226,193]},"credentialInstance":{"type":"Buffer","data":[217,242,84,22,108,120,113,208,204,223,128,247,36,191,150,103,90,252,88,197,111,170,2,134,177,72,84,5,45,48,104,3]},"coinInstance":{"type":"Buffer","data":[17,99,174,47,0,69,241,116,185,204,159,151,51,106,209,8,120,160,120,98,160,131,218,102,205,79,235,206,188,66,253,87]},"spawnerInstance":{"type":"Buffer","data":[84,81,112,254,214,26,3,255,174,166,7,146,26,118,74,80,109,109,51,230,66,13,202,166,109,55,93,209,54,205,31,171]},"parties":[],"badges":[],"ropascis":[],"polls":[]}`;
} else {
    Defaults.Roster = Roster.fromTOML(Defaults.RosterTOMLDEDIS);
}
