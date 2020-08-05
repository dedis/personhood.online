import React, { Component } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet } from 'react-native'
import { Text, Avatar, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import { Element } from '../styles'
import { UserAccount, EPFLAccount } from '../network/tequila'

export class Home extends Component {
    state = {
        transactions: [],
        balance: '0.00',
        loading: true,
    }

    componentDidMount() {
        this.loadTransactions()
        this.loadBalance()
    }

    loadTransactions() {
        // fetch('https://randomuser.me/api/?results=20')
        //     .then(res => res.json())
        //     .then(res => this.setState({ transactions: res.results }))
        //     .catch(err => console.error(err))
        UserAccount.bankAccount?.getTransactions(0, 10).then(res => {
            this.setState({ transactions: res })
        })
    }

    async loadBalance() {
        this.updateBalance()
    }

    updateBalance = async () => {
        this.setState({ loading: true })
        let res = await UserAccount.bankAccount!.updateBalance()
        this.setState({ balance: res.toFixed(2), loading: false })

        this.loadTransactions()
    }

    render() {
        return (
            <SafeAreaView style={style.container}>
                <View style={style.header}>
                    <Text style={style.balance}>
                        <Text style={style.currency}>$</Text>{' '}
                        {this.state.balance}
                    </Text>
                    <Button
                        type="clear"
                        icon={<Icon name="md-refresh-circle" size={30} />}
                        loading={this.state.loading}
                        onPress={this.updateBalance}
                    />
                </View>
                <Text style={style.sectionLabel}>Transactions</Text>
                <FlatList
                    data={this.state.transactions}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item: any, index: number) => `${index}`}
                />
            </SafeAreaView>
        )
    }
}

class Item extends Component<{ item: any }> {
    state = {
        profile: undefined,
    }

    symbol = ''
    date = new Date(this.props.item.timestamp.toNumber() * 1000)
    amount = this.props.item.amount.toNumber() / 10000

    componentDidMount() {
        let { item } = this.props

        if (
            item.receiver.address.toLowerCase() ===
            '0x' + UserAccount.bankAccount?.address
        ) {
            this.symbol = '+'
        } else {
            this.symbol = '-'
        }

        EPFLAccount.fetchLADPProfile(
            this.symbol === '+'
                ? item.sender.identifier
                : item.receiver.identifier,
        )
            .then(res => {
                this.setState({ profile: res })
                console.log(res)
            })
            .catch(() => {
                console.log(this.props.item.id + ' profile not found')
            })
    }

    render() {
        let { item } = this.props

        let profile = this.state.profile ?? {
            firstName:
                this.symbol === '+'
                    ? item.sender.identifier
                    : item.receiver.identifier,
            lastName: '',
            avatar: undefined,
        }
        console.log(profile)

        return (
            <View style={style.item}>
                <Avatar
                    rounded
                    size="medium"
                    icon={{ name: 'user', type: 'font-awesome' }}
                    source={{ uri: profile.avatar }}
                />
                <View style={style.nameContainer}>
                    <Text style={style.name}>
                        {profile.firstName} {profile.lastName}
                    </Text>
                    <Text style={style.date}>
                        {this.date.toLocaleDateString()}{' '}
                        {this.date.toLocaleTimeString()}
                    </Text>
                </View>
                <View style={style.amountContainer}>
                    <Text style={style.amount}>
                        {this.symbol} $ {this.amount.toFixed(2).toString()}
                    </Text>
                </View>
            </View>
        )
    }
}

let style = StyleSheet.create({
    container: {
        ...Element.container,
    },
    currency: {
        fontWeight: '600',
        fontSize: 25,
    },
    header: {
        ...Element.header,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    balance: {
        fontWeight: '600',
        fontSize: 50,
    },
    sectionLabel: {
        marginTop: 30,
        ...Element.spacing,
        ...Element.sectionLabel,
    },
    item: {
        marginVertical: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Element.spacing,
        ...Element.card,
    },
    nameContainer: {
        flex: 1,
        flexGrow: 2,
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    name: {
        fontWeight: '600',
    },
    date: {
        color: '#666',
        fontSize: 11,
    },
    amountContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    amount: {
        fontWeight: '600',
        textAlign: 'right',
    },
})
