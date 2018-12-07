// import {Darc, Rule, Rules} from "~/lib/cothority/darc/Darc";
// import {KeyPair} from "~/lib/KeyPair";
// import {Log} from "~/lib/Log";
// import {SignerEd25519} from "~/lib/cothority/darc/SignerEd25519";
// import {IdentityEd25519} from "~/lib/cothority/darc/IdentityEd25519";
//
// let signerHex = ["67a8afe7caff3bb69436d43cf62ebebcf57d0e31597404e6fcfb6e37c9464300",
//     "248461c68740f4f75cc98a77b8092f45d1c02a1fa96430546f2199e3fd7a9d02",
//     "52d3c4c30b75889ce65a8a7c1a728b0a611f61535926cca69ac39adcb921ad01"];
// let signers = signerHex.map(sh => {
//     let kp = new KeyPair(sh);
//     return new SignerEd25519(kp._public, kp._private);
// });
// let identities = signers.map(s => {
//     return s.identity;
// });
// let testDarcBaseIDHex = "62125a176ca291ca6ac30a61bb936ba3d80cf917ea6acdca813f30b94a5d29b4";
// let testDarcProtoHex = "0800120c67656e6573697320646172631a002220e3b0c44298fc1c149afbf4c8" +
//     "996fb92427ae41e4649b934ca495991b7852b8552ac8020aa5010a0d696e766f" +
//     "6b653a65766f6c7665129301656432353531393a393235343430393665653364" +
//     "3063316565326637393438343730613330356462666633636134303162316534" +
//     "6539613964313863633734306531656538363231202620656432353531393a31" +
//     "6263323164653839633566313838386235383536363861653366626536653233" +
//     "643165663462623838336432383235323535663866336430663930636164620a" +
//     "9d010a055f7369676e129301656432353531393a316263323164653839633566" +
//     "3138383862353835363638616533666265366532336431656634626238383364" +
//     "3238323532353566386633643066393063616462207c20656432353531393a35" +
//     "6366643838313065366331333435336238363461356363373535633331613738" +
//     "31363366383563323861633139383437373331666434363033393532353163";
//
// describe("When creating rules,", () => {
//     it("it should take identities", () => {
//         let signers = [new KeyPair(), new KeyPair()];
//         let ids = signers.map(s => {
//             return new IdentityEd25519(s._public);
//         });
//         let r = Rule.fromIdentities("_sign", ids, "|");
//         expect(r.action).toBe("_sign");
//         let e = r.expr.toString('utf-8');
//         expect(e.length).toBe((8 + 64) * 2 + 3);
//         expect(e.split('|').length).toBe(2);
//     });
//
//     it("should create owners and signers", () => {
//         let signers = [new KeyPair(), new KeyPair(), new KeyPair()];
//         let ids = signers.map(s => {
//             return new IdentityEd25519(s._public);
//         });
//         let r = Rules.fromOwnersSigners(ids.slice(0, 2), ids.slice(1, 3));
//         expect(r.list.length).toBe(2);
//         expect(r.list[0].action).toBe("invoke:evolve");
//         let expr0 = r.list[0].expr.toString().split(" & ");
//         expect(expr0.length).toBe(2);
//         expect(r.list[1].action).toBe("_sign");
//         let expr1 = r.list[1].expr.toString().split(" | ");
//         expect(expr1.length).toBe(2);
//         expect(expr0[1]).toBe(expr1[0]);
//     });
// });
//
// describe("When creating darcs", () => {
//     it("should create correct baseID and correct protobuf", () => {
//         let r = Rules.fromOwnersSigners(identities.slice(0, 2), identities.slice(1, 3));
//         let d = Darc.fromRulesDesc(r, "genesis darc");
//         expect(d.getBaseId().toString('hex')).toBe(testDarcBaseIDHex);
//         expect(d.toProto().toString('hex')).toBe(testDarcProtoHex);
//
//         let d2 = Darc.fromProto(Buffer.from(testDarcProtoHex, 'hex'));
//         expect(d2.getBaseId().toString('hex')).toBe(testDarcBaseIDHex);
//         expect(d2.toProto().toString('hex')).toBe(testDarcProtoHex);
//     });
// });