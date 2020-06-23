import React, { Component } from 'react'
import { SafeAreaView, View, FlatList, StyleSheet } from 'react-native'
import { Text, Avatar } from 'react-native-elements'
import { Element } from '../styles'

export class Home extends Component {
    state = {
        transactions: [],
    }

    componentDidMount() {
        this.loadTransactions()
    }

    loadTransactions() {
        fetch('https://randomuser.me/api/?results=20')
            .then(res => res.json())
            .then(res => this.setState({ transactions: res.results }))
            .catch(err => console.error(err))
    }

    render() {
        return (
            <SafeAreaView style={style.container}>
                <Text style={style.balance}>
                    <Text style={style.currency}>$</Text> 32.45
                </Text>
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
                        {Math.random() >= 0.5 ? '+' : '-'} ${' '}
                        {(Math.random() * 100).toFixed(2)}
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
    balance: {
        fontWeight: '600',
        fontSize: 50,
        marginTop: 50,
        marginHorizontal: '8%',
    },
    section: {
        color: '#666',
        marginTop: 30,
        marginHorizontal: '8%',
    },
    item: {
        marginVertical: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '8%',
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
