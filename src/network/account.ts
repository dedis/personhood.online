import { Buffer } from 'buffer'
import {
    CONTRACT_ABI,
    CONTRACT_BYTECODE,
    ROSTER_TOML,
    CONFIG_TOML,
} from './config'
import ByzCoinRPC from '@dedis/cothority/byzcoin/byzcoin-rpc'
import { Roster } from '@dedis/cothority/network'
import toml from 'toml'
import {
    EvmAccount,
    EvmContract,
    BEvmInstance,
    WEI_PER_ETHER,
} from '@dedis/cothority/bevm'
import SignerEd25519 from '@dedis/cothority/darc/signer-ed25519'
import Storage from '@react-native-community/async-storage'

export class CurrencyAccount {
    private storageKey: string
    private contract: EvmContract
    private signer: SignerEd25519
    private bevm?: BEvmInstance = undefined
    private bevmAccount?: EvmAccount = undefined

    constructor(key: string) {
        this.storageKey = key

        this.contract = EvmContract.deserialize({
            abi: CONTRACT_ABI,
            addresses: ['7c78361c5ae324446350b96b119e97dd5e9cc206'],
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

    async getBEvmInstance(
        progress?: (desc: string) => void,
    ): Promise<BEvmInstance> {
        const roster = Roster.fromTOML(ROSTER_TOML)
        const config = toml.parse(CONFIG_TOML)

        progress ? progress('Initiating RPC...') : undefined
        const byzCoinID = Buffer.from(config.ByzCoinID, 'hex')
        const byzcoinRPC = await ByzCoinRPC.fromByzcoin(
            roster,
            byzCoinID,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
        )

        progress ? progress('Initiating BEvm...') : undefined
        const bevmInstanceID = Buffer.from(config.bevmInstanceID, 'hex')
        const bevmInstance = await BEvmInstance.fromByzcoin(
            byzcoinRPC,
            bevmInstanceID,
        )

        return bevmInstance
    }

    async load(progress?: (desc: string) => void) {
        this.bevm = await this.getBEvmInstance(progress)

        progress ? progress('Loading Account...') : undefined
        let value = await Storage.getItem(this.storageKey)
        if (value != null) {
            console.log('account found: ' + value)
            let info = JSON.parse(value)
            this.bevmAccount = EvmAccount.deserialize(info)
            return await this.isMemeber()
            // return true
        }

        progress ? progress('Creating New Account...') : undefined
        this.bevmAccount = new EvmAccount(this.storageKey)
        console.log('new evm account created')
        return false
    }

    async isMemeber() {
        console.log('Calling isMemeber()')
        let result = await this.bevm?.call(
            this.bevmAccount!,
            this.contract,
            0,
            'isMember',
            ['0x' + this.address],
        )
        console.log('isMemeber(): ' + result![0])
        return result![0]
    }

    async save() {
        await Storage.setItem(
            this.storageKey,
            JSON.stringify(this.bevmAccount?.serialize()),
        )
    }

    async create(signature: string[], progress?: (desc: string) => void) {
        if (signature.length <= 0) {
            throw new Error('empty signature error')
        }

        let creditAmount = WEI_PER_ETHER.mul(5)
        console.log('Calling creditAccount()')
        progress ? progress('Initiating an account...') : undefined
        await this.bevm?.creditAccount(
            [this.signer],
            this.bevmAccount!,
            creditAmount,
        )

        console.log(
            `Calling addMember(
                0x${this.address},
                ${this.storageKey},
                ${signature}
            )`,
        )
        progress ? progress('Adding account to system...') : undefined
        await this.bevm?.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            0,
            'addMember',
            ['0x' + this.address, this.storageKey, signature],
        )

        progress ? progress('Checking...') : undefined
        let result = await this.isMemeber()
        if (!result) {
            throw new Error('add member failed')
        }

        console.log('Calling newPeriod()')
        progress ? progress('Getting initial income...') : undefined
        await this.bevm?.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            0,
            'newPeriod',
        )
        await this.save()
    }

    async clear() {
        await Storage.removeItem(this.storageKey)
    }

    async updateBalance(): Promise<number> {
        console.log('Calling balanceOf()')
        let balance = await this.bevm?.call(
            this.bevmAccount!,
            this.contract,
            0,
            'balanceOf',
            ['0x' + this.address],
        )
        console.log('balanceOf(): ' + balance![0])

        return CurrencyAccount.popcoin(balance![0])
    }

    async transferTo(address: string, amount: number) {
        let value = CurrencyAccount.popcent(amount)
        console.log('Actual transfer amount: ' + value)
        console.log('Calling transfer()')
        await this.bevm?.transaction(
            [this.signer],
            1e7,
            1,
            0,
            this.bevmAccount!,
            this.contract,
            0,
            'transfer',
            ['0x' + address, value],
        )
        await this.save()
    }

    async getTransactions(start: number, end: number) {
        console.log(`Calling getTransactions(${start}, ${end})`)
        let result = await this.bevm?.call(
            this.bevmAccount!,
            this.contract,
            0,
            'getTransactions',
            ['0x' + this.address, start, end],
        )
        return result
    }
}
