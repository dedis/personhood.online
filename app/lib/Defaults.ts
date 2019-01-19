import {Roster} from "~/lib/network/Roster";

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
  Public = "1365232c84fb92f66bc003bff0bfb22250a99d6f3cecad4d6c53a64481486e93"
  Description = "Conode_4"
[[servers]]
  Address = "tls://192.168.0.1:7776"
  Suite = "Ed25519"
  Public = "82961f12d49af09492a44929a88c5e7fb6746c4599a59a99e298e7d3c526746c"
  Description = "Conode_3"
[[servers]]
  Address = "tls://192.168.0.1:7774"
  Suite = "Ed25519"
  Public = "da6e0f39da50185fce5656426adcf4e5bad3c27c1f5182f6ae1006c87173b7c9"
  Description = "Conode_2"
[[servers]]
  Address = "tls://192.168.0.1:7772"
  Suite = "Ed25519"
  Public = "057923aabaad24d9a5cf75c1c0d257e84e99ba5fd29db541432e4a1914af9ad2"
  Description = "Conode_1"
`,
    Roster: null,
    // ByzCoinID
    ByzCoinID: Buffer.from("aaa5b2db9523c5c66eedac22d878bc3d718d19f60d944004a53a9b977ed88ba3", 'hex'),
    // SpawnerIID: new InstanceID(Buffer.from("7dc459097579d6ce91f9a6c4ca3f4af6215036cc1e0e7d1dcf80e9c940b7e6a7", 'hex')),
    SpawnerIID: null,

    // - Testing settings

    // If Confirm is false, there are no security confirmations asked. This is for
    // easier UI testing.
    Confirm: true,
    // Testing
    Testing: true,
    // Redirect pop.dedis.ch to another (local) IP
    // NetRedirect: ["pop.dedis.ch", "192.168.0.1"],
    NetRedirect: null,
    // Show Party- and Badges examples
    PartyBadgeExamples: false,
    // Alias can be set to a non-"" value to have a default alias
    Alias: "test",
};

Defaults.Roster = Roster.fromTOML(Defaults.RosterTOMLLOCAL);
