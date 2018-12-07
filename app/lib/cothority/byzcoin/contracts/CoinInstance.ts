import {ByzCoinRPC} from "~/lib/cothority/byzcoin/ByzCoinRPC";
import {Instance} from "~/lib/cothority/byzcoin/Instance";
import {Argument, ClientTransaction, Instruction} from "~/lib/cothority/byzcoin/ClientTransaction";

export class CoinInstance {
    _bc: ByzCoinRPC;
    _instanceID: Buffer;
    _instance: Instance;
    type: Buffer;
    balance: number;

    /**
     * Creates a new CoinInstance
     * @param {ByzCoinRPC} bc - the ByzCoinRPC instance
     * @param {Uint8Array} instanceId - id of the instance
     * @param {Instance} [instance] - the complete instance
     * @param {string} [type] - the type of coin
     * @param {number} [balance] - the current balance of the account
     */
    constructor(bc, instanceId, instance, type, balance) {
        this._bc = bc;
        this._instanceID = instanceId;
        this._instance = instance;
        this.type = type;
        this.balance = balance;
    }

    /**
     * Transfer a certain amount of coin to another account.
     *
     * @param {number} coins - the amount
     * @param {Uint8Array} to - the destination account (must be a coin contract instace id)
     * @param {Signer} signer - the signer (of the giver account)
     * @return {Promise} - a promisse that completes once the transaction has been
     * included in the ledger.
     */
    transfer(coins, to, signer) {
        let args = [];
        let buffer = new Buffer(8);
        buffer.writeUInt32LE(coins, 0);

        args.push(new Argument("coins", buffer));
        args.push(new Argument("destination", to));

        let inst = Instruction.createInvoke(this._instanceID, "transfer", args);
        let ctx = new ClientTransaction([inst]);
        ctx.signBy([signer], [0]);

        return this._bc.sendTransactionAndWait(ctx, 10);
    }

    /**
     * Update the data of this instance
     *
     * @return {Promise<CoinInstance>} - a promise that resolves once the data
     * are up-to-date
     */
    update() {
        return this._bc.getProof(this._instanceID).then(proof => {
            this._instance = Instance.fromProof(proof);
            const model = root.lookup("CoinInstance");
            const protoObject = model.decode(this._instance.data);

            this.type = protoObject.type;
            this.balance = protoObject.balance;

            return Promise.resolve(this);
        });
    }

    static async fromByzcoin(bc: ByzCoinRPC, instID: Buffer): Promise<CoinInstance> {
        return null;
    }
}
