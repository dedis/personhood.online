import {Data} from "~/lib/Data";
import {KeyPair} from "~/lib/KeyPair";
import {Log} from "~/lib/Log";

describe("Initializing Data", ()=>{
    it("Must start with empty values", ()=>{
        let d = new Data();
        expect(d.alias).toBe("");
        expect(d.email).toBe("");
        expect(d.continuousScan).toBe(false);
        expect(d.keyIdentity).not.toBe(null);
        expect(d.keyPersonhood).not.toBe(null);
    });
});

describe("saves and loads", ()=>{
    it ("Must keep data", async ()=>{
        let keyI = new KeyPair();
        let keyP = new KeyPair();
        let dataObj = {
            alias: "alias",
            email: "email@email.com",
            continuousScan: true,
            keyIdentity: keyI,
            keyPersonhood: keyP,
        };
        let d = new Data(dataObj);
        let d2 = new Data();
        expect(d2.getValues()).not.toEqual(d.getValues());
        await d2.load();
        expect(d2.getValues()).not.toEqual(d.getValues());
        await d.save();
        await d2.load();
        expect(d2.getValues()).toEqual(d.getValues());
    })
})