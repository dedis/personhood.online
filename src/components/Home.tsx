import React, { Component } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet } from 'react-native'
import { Text, Avatar, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import { Element } from '../styles'
import { UserAccount, EPFLAccount } from '../network/tequila'

export class Home extends Component<{ navigation: any }> {
    state = {
        transactions: [],
        balance: '0.00',
        loading: true,
    }

    componentDidMount() {
        this.loadTransactions()

        this.props.navigation.addListener('willFocus', this.update)
    }

    async castToItem(transaction: any) {
        var symbol = ''
        var id = ''
        if (
            transaction.receiver.address.toLowerCase() ===
            '0x' + UserAccount.bankAccount?.address
        ) {
            symbol = '+'
            id = transaction.sender.identifier
        } else {
            symbol = '-'
            id = transaction.receiver.identifier
        }

        let date = new Date(transaction.timestamp.toNumber() * 1000)
        let amount = transaction.amount.toNumber() / 10000
        try {
            let profile = await EPFLAccount.fetchLADPProfile(
                id.split(':').pop() as string,
            )
            return { symbol, date, amount, profile }
        } catch (_) {
            return {
                symbol,
                date,
                amount,
                profile: {
                    firstName:
                        symbol === '+'
                            ? transaction.sender.identifier
                            : transaction.receiver.identifier,
                    lastName: '',
                    avatar: undefined,
                },
            }
        }
    }

    async loadTransactions() {
        let res = await UserAccount.bankAccount?.getTransactions(0, 10)

        var items = []
        for (const i in res) {
            items.push(await this.castToItem(res[i]))
        }

        this.setState({ transactions: items })
    }

    update = async () => {
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
                        onPress={this.update}
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
    render() {
        let { item } = this.props

        return (
            <View style={style.item}>
                <Avatar
                    rounded
                    size="medium"
                    icon={{ name: 'user', type: 'font-awesome' }}
                    source={{ uri: item.profile.avatar }}
                />
                <View style={style.nameContainer}>
                    <Text style={style.name}>
                        {item.profile.firstName} {item.profile.lastName}
                    </Text>
                    <Text style={style.date}>
                        {item.date.toLocaleDateString()}{' '}
                        {item.date.toLocaleTimeString()}
                    </Text>
                </View>
                <View style={style.amountContainer}>
                    <Text style={style.amount}>
                        {item.symbol} $ {item.amount.toFixed(2).toString()}
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
        flex: 2,
        justifyContent: 'center',
    },
    amount: {
        fontWeight: '600',
        textAlign: 'right',
    },
})
