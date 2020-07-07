import React, { Component } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet } from 'react-native'
import { Text, Avatar, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import { Element } from '../styles'
import { Account } from '../network/account'

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
        fetch('https://randomuser.me/api/?results=20')
            .then(res => res.json())
            .then(res => this.setState({ transactions: res.results }))
            .catch(err => console.error(err))
    }

    async loadBalance() {
        let res = await Account.getBalance()
        this.setState({ balance: res.toFixed(2) })
        this.updateBalance()
    }

    updateBalance = async () => {
        this.setState({ loading: true })
        let res = await Account.updateBalance()
        this.setState({ balance: res.toFixed(2), loading: false })
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
                <Text style={style.section}>Transactions</Text>
                <FlatList
                    data={this.state.transactions}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={(item: any) => item.login.uuid}
                />
            </SafeAreaView>
        )
    }
}

class Item extends Component<{ item: any }> {
    state = {
        symbol: Math.random() >= 0.5 ? '+' : '-',
        amount: (Math.random() * 100).toFixed(2),
    }

    render() {
        let { item } = this.props
        return (
            <View style={style.item}>
                <Avatar
                    rounded
                    size="medium"
                    source={{ uri: item.picture.medium }}
                />
                <View style={style.nameContainer}>
                    <Text style={style.name}>
                        {item.name.first + ' ' + item.name.last}
                    </Text>
                    <Text style={style.date}>20 Jun, 14:53</Text>
                </View>
                <View style={style.amountContainer}>
                    <Text style={style.amount}>
                        {this.state.symbol} $ {this.state.amount}
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
    section: {
        color: '#666',
        marginTop: 30,
        ...Element.spacing,
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
