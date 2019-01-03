import {KeyPair, Private, Public} from "~/lib/KeyPair";
import {Sign, Suite, Verify} from "~/lib/RingSig";
import {Log} from "~/lib/Log";

fdescribe("When creating Ring Signature", () => {
    let k1 = new KeyPair();
    let k2 = new KeyPair();
    let k3 = new KeyPair();
    let k12 = [k1._public, k2._public];
    let k21 = [k2._public, k1._public];
    let k123 = [k1._public, k2._public, k3._public];
    let msg = Buffer.from("important message");
    let msg2 = Buffer.from("another important message");
    let scope = Buffer.from("scope");
    let scope2 = Buffer.from("scope2");

    it("Find which pairs don't work", async () => {
        let sk1 = Private.one();
        let two = Private.one().add(Private.one());
        let sk2 = new Private(two.scalar);
        for (let i = 0; i < 16; i++) {
            let pk1 = Public.base().mul(sk1);
            let pk2 = Public.base().mul(sk2);
            let k12 = [pk1, pk2];

            let rs = await Sign(msg, k12, null, sk1);
            let sv = await Verify(msg, k12, null, rs.encode());
            expect(sv.valid).toBeTruthy("verification failed for " + i);
            sk1 = sk1.add(two);
            sk2 = sk2.add(two);
        }
    });

    it("Must work when unlinkable", async () => {
        Log.print("testing ring signatures");
        let rs = await Sign(msg, k12, null, k1._private);
        expect(rs.Tag).toBeNull();
        let rsBuf = await rs.encode();
        let sv = await Verify(msg, k12, null, rsBuf);
        expect(sv.valid).toBeTruthy();
        expect(sv.tag).toBeNull();
        sv = await Verify(msg, k21, null, rsBuf);
        expect(sv.valid).toBeTruthy();
        expect(sv.tag).toBeNull();

        await expectAsync(Verify(msg, k123, null, rsBuf)).toBeRejected();
    });

    it("Must work when linkable", async () => {
        Log.print("testing linkable ring signatures");
        let rs = await Sign(msg, k12, scope, k1._private);
        expect(rs.Tag).not.toBeNull();
        let rsBuf = await rs.encode();
        let sv = await Verify(msg, k12, scope, rsBuf);
        expect(sv.valid).toBeTruthy();
        expect(sv.tag).not.toBeNull();
        expect(sv.tag.equal(rs.Tag)).toBeTruthy();

        sv = await Verify(msg, k21, scope, rsBuf);
        expect(sv.valid).toBeTruthy();
        expect(sv.tag).not.toBeNull();

        sv = await Verify(msg, k12, scope2, rsBuf);
        expect(sv.valid).toBeFalsy();
        expect(sv.tag).toBeNull();
    })
});