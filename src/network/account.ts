import Long from 'long'
import { Buffer } from 'buffer'
import { CONTRACT_ABI, CONTRACT_BYTECODE } from './config'
import { Config } from '../lib/config'
import { EvmAccount, EvmContract } from '../lib/bevm'
import SignerEd25519 from '@dedis/cothority/darc/signer-ed25519'
import Storage from '@react-native-community/async-storage'

export type AuthInfoType = {
    identifier: string
    signature: [string]
}

class _Account {
    private static ACCOUNT_KEY = 'epfl_account'
    private static RATE_KEY = 'rate'
    private static BALANCE_KEY = 'balance'

    private contract: EvmContract
    private signer: SignerEd25519
    private bevmConfig?: Config = undefined
    private bevmAccount?: EvmAccount = undefined

    public identifier?: string = undefined

    constructor() {
        this.contract = EvmContract.deserialize({
            abi: CONTRACT_ABI,
            addresses: ['a2a9b82671d9938f2807ea1aad8db52db051a1fd'],
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
        let value = await Storage.getItem(_Account.ACCOUNT_KEY)
        if (value != null) {
            console.log('account found: ' + value)
            let info = JSON.parse(value)
            this.identifier = info.identifier
            this.bevmAccount = EvmAccount.deserialize(info.bevm)
            return true
        }

        this.bevmAccount = new EvmAccount(_Account.ACCOUNT_KEY)
        console.log('new evm account created')
        return false
    }

    async save() {
        await Storage.setItem(
            _Account.ACCOUNT_KEY,
            JSON.stringify({
                identifier: this.identifier,
                bevm: this.bevmAccount?.serialize(),
            }),
        )
    }

    async create(auth: AuthInfoType) {
        this.identifier = auth.identifier
        let creditAmount = Buffer.from(
            Long.fromString('1000000000000000000').mul(5).toBytesBE(),
        )
        console.log('Calling creditAccount()')
        await this.bevmConfig?.bevmRPC.creditAccount(
            [this.signer],
            this.bevmAccount!.address,
            creditAmount,
        )
        console.log('Calling addMember()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            'addMember',
            [
                '"' + this.bevmAccount!.address.toString('hex') + '"',
                '"' + auth.identifier + '"',
                JSON.stringify(auth.signature),
            ],
        )
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
        await Storage.removeItem(_Account.ACCOUNT_KEY)
        await Storage.removeItem(_Account.BALANCE_KEY)
        await Storage.removeItem(_Account.RATE_KEY)
    }

    async getBalance(): Promise<number> {
        let balance = Number(Storage.getItem(_Account.BALANCE_KEY))
        return _Account.popcoin(balance)
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
            ['"' + this.bevmAccount!.address.toString('hex') + '"'],
        )
        // Storage.setItem(_Account.BALANCE_KEY, balance.toString())
        return _Account.popcoin(balance)
    }

    async transferTo(address: string, amount: number) {
        let value = _Account.popcent(amount)
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

export const Account = new _Account()
