import {Identity} from "~/lib/cothority/darc/Identity";
import {Roster} from "~/lib/network/Roster";
import {InstanceID} from "~/lib/cothority/byzcoin/ClientTransaction";

export var Defaults = {
    // If Confirm is false, there are no security confirmations asked. This is for
    // easier UI testing.
    Confirm: false,
    // Standard Roster for the app
    RosterTOML: `
[[servers]]
  Address = "tls://192.168.0.1:7002"
  Suite = "Ed25519"
  Public = "35012fb133f1221f4ea3a539744d248e87a716b8b8d1e1943c0e18ab696778bf"
  Description = "Conode_1"
[[servers]]
  Address = "tls://192.168.0.1:7004"
  Suite = "Ed25519"
  Public = "d072695625c1938533b39f0fc69e3d1054bcabed3b560ea5c74e29e3cf6609f7"
  Description = "Conode_2"
[[servers]]
  Address = "tls://192.168.0.1:7006"
  Suite = "Ed25519"
  Public = "72642f4db36d8c25df04698ab16988c3ab3d798bb5d1d4a985e3e2ceb3ba0869"
  Description = "Conode_3"
[[servers]]
  Address = "tls://192.168.0.1:7008"
  Suite = "Ed25519"
  Public = "6ea71ef2bcd7dfc4c2dc105631ef62b7b7f3f5afdc811058034edf84a5bfa5e8"
  Description = "Conode_4"
`,
    Roster: null,
    // ByzCoinID
    ByzCoinID: Buffer.from("db9d47b31d6aefdd5ad6b7da95267de9b670d44115e8e1a17b7151b6259a3521", 'hex'),
    SpawnerIID: new InstanceID(Buffer.alloc(32)),
    // Testing
    Testing: true,
};

Defaults.Roster = Roster.fromTOML(Defaults.RosterTOML);
