import Long from 'long'
import { Buffer } from 'buffer'
import { CONTRACT_ABI, CONTRACT_BYTECODE } from './config'
import { Config } from '../lib/config'
import { EvmAccount, EvmContract } from '../lib/bevm'
import SignerEd25519 from '@dedis/cothority/darc/signer-ed25519'
import Storage from '@react-native-community/async-storage'
import { indexOf } from '../../mocks/svgMock'

class _Account {
    private static ACCOUNT_KEY = 'account'
    private static RATE_KEY = 'rate'
    private static BALANCE_KEY = 'balance'

    private contract: EvmContract
    private signer: SignerEd25519
    private bevmConfig?: Config = undefined
    private bevmAccount?: EvmAccount = undefined

    constructor() {
        this.contract = EvmContract.deserialize({
            abi: CONTRACT_ABI,
            addresses: ['9fa985bc7c0bcf01baf53519070648e96f676c84'],
            bytecode: CONTRACT_BYTECODE,
            name: 'Popcoin',
        })

        let privKey = Buffer.from(
            '18ef9fb98eb98a1ee8143399487755d21456d2daeaed30f80f1e3da271ad780c',
            'hex',
        )
        this.signer = SignerEd25519.fromBytes(privKey)
    }

    static realCoin(origin: number): number {
        let result = Math.round(origin / 100) / 100
        return Number.isNaN(result) ? 0 : result
    }

    public get address(): string | undefined {
        return this.bevmAccount?.address.toString('hex')
    }

    async loadConfig() {
        this.bevmConfig = await Config.init()
    }

    async load() {
        await this.loadConfig()
        let value = await Storage.getItem(_Account.ACCOUNT_KEY)
        if (value != null) {
            console.log('account found: ' + value)
            this.bevmAccount = EvmAccount.deserialize(JSON.parse(value))
        } else {
            await this.create('test')
        }
    }

    async create(name: string) {
        this.bevmAccount = new EvmAccount(name)
        let creditAmount = Buffer.from(
            Long.fromString('1000000000000000000').mul(5).toBytesBE(),
        )
        await this.bevmConfig?.bevmRPC.creditAccount(
            [this.signer],
            this.bevmAccount.address,
            creditAmount,
        )
        console.log('Calling addMember()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount,
            this.contract,
            'addMember',
            ['"' + this.bevmAccount.address.toString('hex') + '"'],
        )
        console.log('Calling newPeriod()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount,
            this.contract,
            'newPeriod',
            [],
        )
        await Storage.setItem(
            _Account.ACCOUNT_KEY,
            JSON.stringify(this.bevmAccount.serialize()),
        )
    }

    async clear() {
        await Storage.removeItem(_Account.ACCOUNT_KEY)
        await Storage.removeItem(_Account.BALANCE_KEY)
        await Storage.removeItem(_Account.RATE_KEY)
    }

    async getBalance(): Promise<number> {
        let rate = Number(Storage.getItem(_Account.RATE_KEY))
        let balance = Number(Storage.getItem(_Account.BALANCE_KEY))
        return _Account.realCoin(balance / rate)
    }

    async getExchangeRate(): Promise<number> {
        console.log('Calling exchangeRate()')
        let rate = await this.bevmConfig?.bevmRPC.call(
            this.bevmConfig.byzcoinRPC.genesisID,
            this.bevmConfig.rosterToml,
            this.bevmConfig.bevmRPC.id,
            this.bevmAccount!,
            this.contract,
            'exchangeRate',
            [],
        )
        Storage.setItem(_Account.RATE_KEY, rate.toString())
        return rate
    }

    async updateBalance(): Promise<number> {
        let rate = await this.getExchangeRate()
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
        Storage.setItem(_Account.BALANCE_KEY, balance.toString())
        return _Account.realCoin(balance / rate)
    }

    async transferTo(address: string, amount: number) {
        console.log('Calling transfer()')
        await this.bevmConfig?.bevmRPC.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            'transfer',
            ['"' + address + '"', '"' + amount + '"'],
        )
    }
}

export namespace Account {
    const instance = new _Account()

    export function address(): string {
        return instance.address ?? 'loading'
    }

    export async function load() {
        await instance.load()
    }

    export async function getBalance(): Promise<number> {
        return instance.getBalance()
    }

    export async function updateBalance(): Promise<number> {
        return instance.updateBalance()
    }

    export async function transferTo(address: string, amount: number) {
        await instance.transferTo(address, amount)
    }
}
