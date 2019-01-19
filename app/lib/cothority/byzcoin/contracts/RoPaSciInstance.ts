import {BasicInstance} from "~/lib/cothority/byzcoin/contracts/Instance";
import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Proof} from "~/lib/cothority/byzcoin/Proof";
import {Coin, CoinInstance} from "~/lib/cothority/byzcoin/contracts/CoinInstance";
import {Argument, ClientTransaction, InstanceID, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";
import {objToProto, Root} from "~/lib/cothority/protobuf/Root";
import {Signer} from "~/lib/cothority/darc/Signer";
import {Buffer} from "buffer";
import {Log} from "~/lib/Log";

const crypto = require("crypto-browserify");

export class RoPaSciInstance extends BasicInstance {
    static readonly contractID = "ropasci";

    public roPaSciStruct: RoPaSciStruct;

    constructor(public bc: ByzCoinRPC, p: Proof | any = null) {
        super(bc, RoPaSciInstance.contractID, p);
        this.roPaSciStruct = RoPaSciStruct.fromProto(this.data);
        Log.print(this.roPaSciStruct.stake.value);
    }

    async second(coin: CoinInstance, signer: Signer, choice: number): Promise<any> {
        if (!coin.coin.name.equals(this.roPaSciStruct.stake.name)) {
            return Promise.reject("not correct coin-type for player 2");
        }
        if (coin.coin.value.lessThan(this.roPaSciStruct.stake.value)) {
            return Promise.reject("don't have enough coins to match stake");
        }
        Log.print(this.roPaSciStruct.stake.value);
        let ctx = new ClientTransaction([
            Instruction.createInvoke(coin.iid,
                "fetch", [
                    new Argument("coins", Buffer.from(this.roPaSciStruct.stake.value.toBytesLE()))
                ]),
            Instruction.createInvoke(this.iid,
                "second", [
                    new Argument("account", coin.iid.iid),
                    new Argument("choice", Buffer.from([choice % 3]))
                ])
        ]);
        await ctx.signBy([[signer], []], this.bc);
        await this.bc.sendTransactionAndWait(ctx);
    }

    async confirm(choice: number, fillup: Buffer, coin: CoinInstance) {
        if (!coin.coin.name.equals(this.roPaSciStruct.stake.name)) {
            return Promise.reject("not correct coin-type for player 1");
        }
        if (fillup.length != 31) {
            return Promise.reject("need 31 bytes in the fillup")
        }
        let preHash = Buffer.alloc(32);
        preHash[0] = choice % 3;
        fillup.copy(preHash, 1);
        let fph = crypto.createHash("sha256");
        fph.update(preHash);
        let fphBuf = fph.digest();
        if (!fphBuf.equals(this.roPaSciStruct.firstPlayerHash)) {
            return Promise.reject("not correct pre-hash");
        }
        let ctx = new ClientTransaction([
            Instruction.createInvoke(this.iid,
                "confirm", [
                    new Argument("prehash", preHash),
                    new Argument("account", coin.iid.iid),
                ])
        ]);
        await this.bc.sendTransactionAndWait(ctx);
    }

    static fromObject(bc: ByzCoinRPC, obj: any): RoPaSciInstance {
        return new RoPaSciInstance(bc, obj);
    }

    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<RoPaSciInstance> {
        return new RoPaSciInstance(bc, await bc.getProof(iid));
    }
}

export class RoPaSciStruct {
    static readonly protoName = "personhood.RoPaSciStruct";

    constructor(public stake: Coin, public firstPlayerHash: Buffer, public firstPlayer: number,
                public secondPlayer: number, public secondPlayerAccount: InstanceID) {
    }

    toObject(): object {
        return {
            stake: this.stake.toObject(),
            firstplayerhash: this.firstPlayerHash,
            firstplayer: this.firstPlayer,
            secondplayer: this.secondPlayer,
            secondplayeraccount: this.secondPlayerAccount,
        }
    }

    toProto(): Buffer {
        return objToProto(this.toObject(), RoPaSciStruct.protoName);
    }

    static fromProto(buf: Buffer): RoPaSciStruct {
        let rps = Root.lookup(RoPaSciStruct.protoName).decode(buf);
        return new RoPaSciStruct(new Coin(rps.stake), Buffer.from(rps.firstplayerhash),
            rps.firstplayer, rps.secondplayer, InstanceID.fromObjectBuffer(rps.secondplayeraccount));
    }
}