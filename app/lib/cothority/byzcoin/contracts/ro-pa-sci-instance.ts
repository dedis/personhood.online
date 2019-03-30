import { Message, Properties } from "protobufjs/light";
import Signer from "../../darc/signer";
import { EMPTY_BUFFER, registerMessage } from "../../protobuf";
import ByzCoinRPC from "../byzcoin-rpc";
import ClientTransaction, { Argument, Instruction } from "../client-transaction";
import Instance, { InstanceID } from "../instance";
import CoinInstance, { Coin } from "./coin-instance";

export default class RoPaSciInstance extends Instance{
    static readonly contractID = "ropasci";

    /**
     * Fetch the proof for the given instance and create a
     * RoPaSciInstance from it
     *
     * @param bc    The ByzCoinRPC to use
     * @param iid   The instance ID
     * @returns the new instance
     */
    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID): Promise<RoPaSciInstance> {
        return new RoPaSciInstance(bc, await Instance.fromByzCoin(bc, iid));
    }

    private rpc: ByzCoinRPC;
    private instance: Instance;
    public struct: RoPaSciStruct;
    private fillUp: Buffer;
    private firstMove: number;

    constructor(bc: ByzCoinRPC, inst: Instance) {
        super(inst);
        this.rpc = bc;
        this.instance = inst;
        this.struct = RoPaSciStruct.decode(this.instance.data);
    }

    get stake(): Coin {
        return this.struct.stake;
    }

    get playerChoice(): number {
        return this.struct.firstPlayer;
    }

    /**
     * Getter for the second player ID
     * @returns id as a buffer
     */
    get adversaryID(): Buffer {
        return this.struct.secondPlayerAccount;
    }

    /**
     * Getter for the second player choice
     * @returns the choice as a number
     */
    get adversaryChoice(): number {
        return this.struct.secondPlayer;
    }

    /**
     * Update the instance data
     *
     * @param choice The choice of the first player
     * @param fillup The fillup of the first player
     */
    setChoice(choice: number, fillup: Buffer) {
        this.firstMove = choice;
        this.fillUp = fillup;
    }

    /**
     * Check if both players have played their moves
     *
     * @returns true when both have played, false otherwise
     */
    isDone(): boolean {
        return this.struct.secondPlayer >= 0;
    }

    /**
     * Play the adversary move
     *
     * @param coin      The CoinInstance of the second player
     * @param signer    Signer for the transaction
     * @param choice    The choice of the second player
     * @returns a promise that resolves on success, or rejects with the error
     */
    async second(coin: CoinInstance, signer: Signer, choice: number): Promise<void> {
        if (!coin.name.equals(this.struct.stake.name)) {
            throw new Error("not correct coin-type for player 2");
        }
        if (coin.value.lessThan(this.struct.stake.value)) {
            throw new Error("don't have enough coins to match stake");
        }

        const ctx = new ClientTransaction({
            instructions: [
                Instruction.createInvoke(
                    coin.id,
                    CoinInstance.contractID,
                    "fetch",
                    [
                        new Argument({ name: "coins", value: Buffer.from(this.struct.stake.value.toBytesLE()) }),
                    ],
                ),
                Instruction.createInvoke(
                    this.instance.id,
                    RoPaSciInstance.contractID,
                    "second",
                    [
                        new Argument({ name: "account", value: coin.id }),
                        new Argument({ name: "choice", value: Buffer.from([choice % 3]) }),
                    ],
                ),
            ],
        });

        await ctx.updateCounters(this.rpc, [signer]);
        // TODO: correctly sign only the first instruction and not the second.
        ctx.signWith([[signer], []]);

        await this.rpc.sendTransactionAndWait(ctx);
    }

    /**
     * Reveal the move of the first player
     *
     * @param coin The CoinInstance of the first player
     * @returns a promise that resolves on success, or rejects
     * with the error
     */
    async confirm(coin: CoinInstance): Promise<void> {
        if (!coin.name.equals(this.struct.stake.name)) {
            throw new Error("not correct coin-type for player 1");
        }

        const preHash = Buffer.alloc(32, 0);
        preHash[0] = this.firstMove % 3;
        this.fillUp.copy(preHash, 1);
        const ctx = new ClientTransaction({
            instructions: [
                Instruction.createInvoke(
                    this.instance.id,
                    RoPaSciInstance.contractID,
                    "confirm",
                    [
                        new Argument({ name: "prehash", value: preHash }),
                        new Argument({ name: "account", value: coin.id }),
                    ],
                ),
            ],
        });

        await this.rpc.sendTransactionAndWait(ctx);
        await this.update()
    }

    /**
     * Update the state of the instance
     *
     * @returns a promise that resolves with the updated instance,
     * or rejects with the error
     */
    async update(): Promise<RoPaSciInstance> {
        const proof = await this.rpc.getProof(this.instance.id);
        if (!proof.exists(this.instance.id)) {
            throw new Error("fail to get a matching proof");
        }

        this.instance = Instance.fromProof(this.instance.id, proof);
        this.struct = RoPaSciStruct.decode(this.instance.data);
        return this;
    }
}

/**
 * Data hold by a rock-paper-scissors instance
 */
export class RoPaSciStruct extends Message<RoPaSciStruct> {
    /**
     * @see README#Message classes
     */
    static register() {
        registerMessage("personhood.RoPaSciStruct", RoPaSciStruct);
    }

    readonly description: string;
    readonly stake: Coin;
    readonly firstPlayerHash: Buffer;
    readonly firstPlayer: number;
    readonly secondPlayer: number;
    readonly secondPlayerAccount: Buffer;

    constructor(props?: Properties<RoPaSciStruct>) {
        super(props);

        this.firstPlayerHash = Buffer.from(this.firstPlayerHash || EMPTY_BUFFER);
        this.secondPlayerAccount = Buffer.from(this.secondPlayerAccount || EMPTY_BUFFER);

        Object.defineProperty(this, "firstplayer", {
            get(): number {
                return this.firstPlayer;
            },
            set(value: number) {
                this.firstPlayer = value;
            },
        });

        Object.defineProperty(this, "firstplayerhash", {
            get(): Buffer {
                return this.firstPlayerHash;
            },
            set(value: Buffer) {
                this.firstPlayerHash = value;
            },
        });

        Object.defineProperty(this, "secondplayer", {
            get(): number {
                return this.secondPlayer;
            },
            set(value: number) {
                this.secondPlayer = value;
            },
        });

        Object.defineProperty(this, "secondplayeraccount", {
            get(): Buffer {
                return this.secondPlayerAccount;
            },
            set(value: Buffer) {
                this.secondPlayerAccount = value;
            },
        });
    }

    /**
     * Helper to encode the struct using protobuf
     *
     * @returns the data as a buffer
     */
    toBytes(): Buffer {
        return Buffer.from(RoPaSciStruct.encode(this).finish());
    }
}

RoPaSciStruct.register();
