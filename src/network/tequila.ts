import { CurrencyAccount } from './account'
import Storage from '@react-native-community/async-storage'

type EPFLProfile = {
    identifier: string
    firstName: string
    lastName: string
    email: string
}

export class EPFLAccount {
    private static ACCOUNT_KEY = 'epfl_account'

    public bankAccount?: CurrencyAccount
    public token?: string
    public profile?: EPFLProfile

    async updateProfile(): Promise<EPFLProfile> {
        if (!this.token) {
            throw new Error('empty token not allowed')
        }
        return fetch('https://test-tequila.epfl.ch/OAUTH2IdP/userinfo', {
            method: 'GET',
            headers: {
                Authorization: this.token,
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.Sciper) {
                    this.profile = {
                        identifier: res.Sciper,
                        firstName: res.Firstname,
                        lastName: res.Name,
                        email: res.Email,
                    }
                    return this.profile
                }
                throw new Error('identifier lost in user profile')
            })
    }

    async loadCurrencyAccount() {
        let profile = await this.updateProfile()
        this.bankAccount = new CurrencyAccount('EPFL:' + profile.identifier)
        let isExist = await this.bankAccount.load()
        if (!isExist) {
            let req = JSON.stringify({
                bearer: this.token?.split(' ')[1],
                addr: this.bankAccount.address,
            })
            console.log('Send signing info: ' + req)
            let res = await fetch(
                'https://epflcoin.cothority.net/oauth2/sign',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: req,
                },
            )

            let data = await res.json()
            console.log(`sign user id: ${JSON.stringify(data)}`)
            await this.bankAccount.create(data.signature)
        }
        await this.save()
    }

    async init() {
        let token = await Storage.getItem(EPFLAccount.ACCOUNT_KEY)
        if (token === null) {
            throw new Error('account not exist')
        }
        this.token = token
        return this.loadCurrencyAccount()
    }

    async save() {
        Storage.setItem(EPFLAccount.ACCOUNT_KEY, this.token!)
    }

    clear() {
        Storage.removeItem(EPFLAccount.ACCOUNT_KEY)
        this.bankAccount?.clear()
    }
}

export const UserAccount = new EPFLAccount()
