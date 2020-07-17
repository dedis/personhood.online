import Long from 'long'
import { Buffer } from 'buffer'
import { CONTRACT_ABI, CONTRACT_BYTECODE } from './config'
import { Config } from '../lib/config'
import { EvmAccount, EvmContract } from '../lib/bevm'
import SignerEd25519 from '@dedis/cothority/darc/signer-ed25519'
import Storage from '@react-native-community/async-storage'

export class CurrencyAccount {
    private storageKey: string
    private contract: EvmContract
    private signer: SignerEd25519
    private bevmConfig?: Config = undefined
    private bevmAccount?: EvmAccount = undefined

    constructor(key: string) {
        this.storageKey = key

        this.contract = EvmContract.deserialize({
            abi: CONTRACT_ABI,
            addresses: ['1cc2b1968351e19761bdf60c0ba112209fc66ab8'],
            bytecode: CONTRACT_BYTECODE,
            name: 'Popcoin',
        })

        let privKey = Buffer.from(
            '18ef9fb98eb98a1ee8143399487755d21456d2daeaed30f80f1e3da271ad780c',
            'hex',
        )
        this.signer = SignerEd25519.fromBytes(privKey)
    }

    public get nonce(): number | undefined {
        return this.bevmAccount?.nonce
    }

    public incNonce() {
        this.bevmAccount?.incNonce()
    }

    public decNonce() {
        this.bevmAccount?.decNonce()
    }

    static popcoin(origin: number): number {
        let result = Math.round(origin / 100) / 100
        return Number.isNaN(result) ? 0 : result
    }

    static popcent(popcoin: number): number {
        return popcoin * 10000
    }

    public get address(): string | undefined {
        return this.bevmAccount?.address.toString('hex')
    }

    async loadConfig() {
        console.log('loading BEVM config...')
        this.bevmConfig = await Config.init()
        console.log('BEVM config loaded')
    }

    async load() {
        await this.loadConfig()
        let value = await Storage.getItem(this.storageKey)
        if (value != null) {
            console.log('account found: ' + value)
            let info = JSON.parse(value)
            this.bevmAccount = EvmAccount.deserialize(info)
            // return await this.isMemeber()
            return true
        }

        this.bevmAccount = new EvmAccount(this.storageKey)
        console.log('new evm account created')
        return false
    }

    async isMemeber() {
        console.log('Calling isMemeber()')
        let result = await this.bevmConfig?.bevmRPC.call(
            this.bevmConfig.byzcoinRPC.genesisID,
            this.bevmConfig.rosterToml,
            this.bevmConfig.bevmRPC.id,
            this.bevmAccount!,
            this.contract,
            'isMember',
            ['"' + this.address + '"'],
        )
        console.log('isMemeber(): ' + result)
        return result
    }

    async save() {
        await Storage.setItem(
            this.storageKey,
            JSON.stringify(this.bevmAccount?.serialize()),
        )
    }

    async create(signature: string[]) {
        if (signature.length <= 0) {
            throw new Error('empty signature error')
        }

        let creditAmount = Buffer.from(
            Long.fromString('1000000000000000000').mul(5).toBytesBE(),
        )
        console.log('Calling creditAccount()')
        await this.bevmConfig?.bevmRPC.creditAccount(
            [this.signer],
            this.bevmAccount!.address,
            creditAmount,
        )
        console.log(
            `Calling addMember(
                ${this.address},
                ${this.storageKey},
                ${signature}
            )`,
        )
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            'addMember',
            [
                '"0x' + this.address + '"',
                '"' + this.storageKey + '"',
                JSON.stringify(signature),
            ],
        )

        let result = await this.isMemeber()
        if (!result) {
            throw new Error('add member failed')
        }

        console.log('Calling newPeriod()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            'newPeriod',
            [],
        )
        await this.save()
    }

    async clear() {
        await Storage.removeItem(this.storageKey)
    }

    async updateBalance(): Promise<number> {
        console.log('Calling balanceOf()')
        let balance = await this.bevmConfig?.bevmRPC.call(
            this.bevmConfig.byzcoinRPC.genesisID,
            this.bevmConfig.rosterToml,
            this.bevmConfig.bevmRPC.id,
            this.bevmAccount!,
            this.contract,
            'balanceOf',
            ['"' + this.address + '"'],
        )
        console.log('balanceOf(): ' + balance)
        // Storage.setItem(_Account.BALANCE_KEY, balance.toString())
        return CurrencyAccount.popcoin(balance)
    }

    async transferTo(address: string, amount: number) {
        let value = CurrencyAccount.popcent(amount)
        console.log('Actual transfer amount: ' + value)
        console.log('Calling transfer()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            'transfer',
            ['"' + address + '"', '"' + value + '"'],
        )
        await this.save()
    }
}
