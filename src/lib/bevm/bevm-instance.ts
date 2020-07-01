import { createHash, randomBytes } from "crypto";
import { ec } from "elliptic";
import Keccak from "keccak";

import ByzCoinRPC from "@dedis/cothority/byzcoin/byzcoin-rpc";
import ClientTransaction, { Argument, Instruction } from "@dedis/cothority/byzcoin/client-transaction";
import Instance, { InstanceID } from "@dedis/cothority/byzcoin/instance";
import Signer from "@dedis/cothority/darc/signer";
import Log from "@dedis/cothority/log";

import { StainlessRPC } from "../stainless";
import { SelectableColl, UserEvmInfo } from "../storage";

export class EvmAccount extends UserEvmInfo {
    static EC = new ec("secp256k1");

    static deserialize(obj: any): EvmAccount {
        return new EvmAccount(obj.name, obj.privateKey, obj.nonce);
    }

    private static computeAddress(key: ec.KeyPair): Buffer {
        // Marshal public key to binary
        const pubBytes = Buffer.from(key.getPublic("hex"), "hex");

        const h = new Keccak("keccak256");
        h.update(pubBytes.slice(1));

        const address = h.digest().slice(12);
        Log.llvl2("Computed account address", address.toString("hex"));

        return address;
    }

    readonly address: Buffer;
    readonly name: string;
    private _nonce: number;
    private key: ec.KeyPair;

    get nonce() {
        return this._nonce;
    }

    constructor(name: string, privKey?: Buffer, nonce: number = 0) {
        super();

        this.name = name;

        if (privKey === undefined) {
            privKey = randomBytes(32);
        }
        this.key = EvmAccount.EC.keyFromPrivate(privKey);

        this.address = EvmAccount.computeAddress(this.key);
        this._nonce = nonce;
    }

    sign(hash: Buffer): Buffer {
        /* The "canonical" option is crucial to have the same signature as Ethereum */
        const sig = this.key.sign(hash, {canonical: true});

        const r = Buffer.from(sig.r.toArray("be", 32));
        const s = Buffer.from(sig.s.toArray("be", 32));

        const len = r.length + s.length + 1;

        const buf = Buffer.concat([r, s], len);
        buf.writeUInt8(sig.recoveryParam, len - 1);

        return buf;
    }

    incNonce() {
        this._nonce += 1;
    }

    serialize(): object {
        return {
            name: this.name,
            nonce: this.nonce,
            privateKey: this.key.getPrivate("hex"),
        };
    }
}

export class EvmContract extends UserEvmInfo {
    static deserialize(obj: any): EvmContract {
        const addresses = obj.addresses.map((elem: string) => Buffer.from(elem, "hex"));
        const bytecode = Buffer.from(obj.bytecode, "hex");

        const contract = new EvmContract(obj.name, bytecode, obj.abi);
        contract._addresses = new SelectableColl<Buffer>(addresses);

        return contract;
    }

    private static computeAddress(data: Buffer, nonce: number): Buffer {
        const buf = EvmContract.erlEncode(data, nonce);

        const h = new Keccak("keccak256");
        h.update(buf);

        const address = h.digest().slice(12);
        Log.llvl2("Computed contract address", address.toString("hex"));

        return address;
    }

    // Translated from the Go Ethereum code
    private static erlEncode(address: Buffer, nonce: number): Buffer {
        const bufNonce = Buffer.alloc(8);
        bufNonce.writeUInt32BE(nonce / (2 ** 32), 0);
        bufNonce.writeUInt32BE(nonce % (2 ** 32), 4);
        let size = 8;
        for (let i = 0; (i < 8) && (bufNonce[i] === 0); i++) {
            size--;
        }

        const addressLen = address.length + 1;
        const nonceLen = (nonce < 128 ? 1 : size + 1);

        const buf = Buffer.alloc(1 + addressLen + nonceLen);
        let pos = 0;

        buf.writeUInt8(0xc0 + addressLen + nonceLen, pos++);

        buf.writeUInt8(0x80 + address.length, pos++);
        address.copy(buf, 2);
        pos += address.length;

        if ((nonce === 0) || (nonce >= 128)) {
            buf.writeUInt8(0x80 + size, pos++);
        }

        bufNonce.copy(buf, pos, 8 - size);

        return buf;
    }

    readonly name: string;
    readonly bytecode: Buffer;
    readonly abi: string;
    readonly transactions: SelectableColl<string>;
    readonly viewMethods: SelectableColl<string>;
    private _addresses: SelectableColl<Buffer> = new SelectableColl<Buffer>([]);

    constructor(name: string, bytecode: Buffer, abi: string) {
        super();

        this.name = name;
        this.bytecode = bytecode;
        this.abi = abi;

        const abiObj = JSON.parse(abi);
        const transactions = abiObj.filter((elem: any) => {
            return elem.type === "function" &&  elem.stateMutability !== "view";
        }).map((elem: any) => elem.name);
        this.transactions = new SelectableColl<string>(transactions);

        const viewMethods = abiObj.filter((elem: any) => {
            return elem.type === "function" &&  elem.stateMutability === "view";
        }).map((elem: any) => elem.name);
        this.viewMethods = new SelectableColl<string>(viewMethods);
    }

    get addresses(): SelectableColl<Buffer> {
        return this._addresses;
    }

    createNewAddress(account: EvmAccount) {
        const newAddress = EvmContract.computeAddress(account.address, account.nonce);
        this.addresses.add(newAddress);
    }

    serialize(): object {
        return {
            abi: this.abi,
            addresses: this.addresses.elements.map((address) => address.toString("hex")),
            bytecode: this.bytecode.toString("hex"),
            name: this.name,
        };
    }
}

export class BevmRPC extends Instance {
    static readonly contractID = "bevm";

    static readonly commandTransaction = "transaction";
    static readonly argumentTx = "tx";

    static readonly commandCredit = "credit";
    static readonly argumentAddress = "address";
    static readonly argumentAmount = "amount";

    /**
     * Generate the BEvm instance ID for a given darc ID
     *
     * @param buf Any buffer that is known to the caller
     * @returns the id as a buffer
     */
    static getInstanceID(buf: Buffer): InstanceID {
        const h = createHash("sha256");
        h.update(Buffer.from(BevmRPC.contractID));
        h.update(buf);
        return h.digest();
    }

    /**
     * Spawn a BEvm instance from a darc id
     *
     * @param bc        The RPC to use
     * @param darcID    The darc instance ID
     * @param signers   The list of signers for the transaction
     * @returns a promise that resolves with the new instance
     */
    static async spawn(bc: ByzCoinRPC, darcID: InstanceID, signers: Signer[]): Promise<BevmRPC> {
        const inst = Instruction.createSpawn(
            darcID,
            BevmRPC.contractID,
            [],
        );

        const ctx = ClientTransaction.make(bc.getProtocolVersion(), inst);
        await ctx.updateCountersAndSign(bc, [signers]);

        await bc.sendTransactionAndWait(ctx);

        return BevmRPC.fromByzcoin(bc, ctx.instructions[0].deriveId(), 2);
    }

    /**
     * Create returns a BevmRPC from the given parameters.
     * @param bc
     * @param bevmID
     * @param darcID
     */
    static create(bc: ByzCoinRPC, bevmID: InstanceID, darcID: InstanceID): BevmRPC {
        return new BevmRPC(bc, new Instance({
            contractID: BevmRPC.contractID,
            darcID,
            data: Buffer.from(""),
            id: bevmID,
        }));
    }

    /**
     * Initializes using an existing coinInstance from ByzCoin
     * @param bc    The RPC to use
     * @param iid   The instance ID
     * @returns a promise that resolves with the BEvm instance
     */
    static async fromByzcoin(bc: ByzCoinRPC, iid: InstanceID,
                             waitMatch: number = 0, interval: number = 1000): Promise<BevmRPC> {
        return new BevmRPC(bc, await Instance.fromByzcoin(bc, iid, waitMatch, interval));
    }

    private stainlessRPC: StainlessRPC;

    constructor(private rpc: ByzCoinRPC, inst: Instance) {
        super(inst);
        if (inst.contractID.toString() !== BevmRPC.contractID) {
            throw new Error(`mismatch contract name: ${inst.contractID} vs ${BevmRPC.contractID}`);
        }
    }

    setStainlessRPC(rpc: StainlessRPC) {
        this.stainlessRPC = rpc;
    }

    /**
     * * Execute a BEvm transaction.
     *
     * FIXME: document parameters
     */
    async deploy(signers: Signer[], gasLimit: number, gasPrice: number, amount: number,
                 account: EvmAccount, contract: EvmContract, args?: string[],
                 wait?: number) {
        const unsignedTx = await this.stainlessRPC.deployContract(gasLimit, gasPrice, amount, account.nonce,
                                                                  contract.bytecode, contract.abi, args);
        const signature = account.sign(Buffer.from(unsignedTx.TransactionHash));
        const signedTx = await this.stainlessRPC.finalizeTransaction(Buffer.from(unsignedTx.Transaction), signature);

        await this.invoke(
            BevmRPC.commandTransaction, [
                new Argument({name: BevmRPC.argumentTx, value: Buffer.from(signedTx.Transaction)}),
            ],
            signers, wait);

        contract.createNewAddress(account);
        account.incNonce();
    }

    /**
     * * Execute a BEvm transaction.
     *
     * FIXME: document parameters
     */
    async transaction(signers: Signer[], gasLimit: number, gasPrice: number, amount: number,
                      account: EvmAccount, contract: EvmContract, method: string, args?: string[],
                      wait?: number) {
        const contractAddress = contract.addresses.selected;
        const unsignedTx = await this.stainlessRPC.executeTransaction(gasLimit, gasPrice, amount,
                                                                      contractAddress, account.nonce,
                                                                      contract.abi, method, args);
        const signature = account.sign(Buffer.from(unsignedTx.TransactionHash));
        const signedTx = await this.stainlessRPC.finalizeTransaction(Buffer.from(unsignedTx.Transaction), signature);

        await this.invoke(
            BevmRPC.commandTransaction, [
                new Argument({name: BevmRPC.argumentTx, value: Buffer.from(signedTx.Transaction)}),
            ],
            signers, wait);

        account.incNonce();
    }

    /**
     * * Execute a BEvm view method.
     *
     * FIXME: document parameters
     */
    async call(blockId: Buffer, serverConfig: string, bevmInstanceId: Buffer,
               account: EvmAccount, contract: EvmContract, method: string, args?: string[]):
                   Promise<any> {
        const contractAddress = contract.addresses.selected;
        const response = await this.stainlessRPC.call(blockId, serverConfig, bevmInstanceId,
                                                      account.address, contractAddress,
                                                      contract.abi, method, args);

        return JSON.parse(response.Result);
    }

    async creditAccount(signers: Signer[], address: Buffer, amount: Buffer, wait?: number) {
        await this.invoke(
            BevmRPC.commandCredit, [
                new Argument({name: BevmRPC.argumentAddress, value: address}),
                new Argument({name: BevmRPC.argumentAmount, value: amount}),
            ],
            signers, wait);
    }

    private async invoke(command: string, args: Argument[], signers: Signer[], wait?: number) {
        const ctx = ClientTransaction.make(
            this.rpc.getProtocolVersion(),
            Instruction.createInvoke(
                this.id, BevmRPC.contractID, command, args,
            ));

        await ctx.updateCountersAndSign(this.rpc, [signers]);

        await this.rpc.sendTransactionAndWait(ctx, wait);
    }
}
