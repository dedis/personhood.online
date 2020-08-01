import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native'
import { Text, Button } from 'react-native-elements'
import { Element } from '../styles'
import Storage from '@react-native-community/async-storage'
import { ProgressOverlay } from './ProgressOverlay'
import { UserAccount } from '../network/tequila'
import { Actions } from 'react-native-router-flux'

const ERROR_KEY = 'transaction-last-error'

export class Exchange extends Component {
    state = {
        address: '',
        addressError: '',
        amount: '0',
        amountError: '',
        paying: false,
        paymentError: '',
        success: '',
    }

    pay = () => {
        const { address, amount } = this.state
        if (address.length === 40 && !Number.isNaN(Number(amount))) {
            this.setState({ paying: true })
            UserAccount.bankAccount!.transferTo(address, Number(amount))
                .then(() => {
                    setTimeout(() => {
                        this.setState({
                            paying: false,
                            success: '',
                            amount: '0',
                        })
                    }, 3000)
                    this.setState({ success: 'Transfered' })
                    Storage.removeItem(ERROR_KEY)
                })
                .catch(reason => {
                    setTimeout(() => {
                        this.setState({ paying: false, paymentError: '' })
                    }, 3000)

                    let error = reason.toString()
                    console.log(error)
                    if (error.match(/nonce too low/g) !== null) {
                        Storage.setItem(ERROR_KEY, 'Too Low')
                        this.setState({ paymentError: 'Nonce Too Low' })
                    } else if (error.match(/nonce too high/g) !== null) {
                        Storage.setItem(ERROR_KEY, 'Too Hight')
                        this.setState({ paymentError: 'Nonce Too High' })
                    } else {
                        Storage.setItem(ERROR_KEY, 'Unknown')
                        this.setState({ paymentError: 'Unknown Error' })
                        Alert.alert('Transaction Error', error, [
                            { text: 'OK' },
                        ])
                    }
                })
        }
    }

    onAddressChanged = (address: string) => {
        if (address.length !== 40) {
            this.setState({ addressError: 'Address length has to be 40' })
        } else {
            this.setState({ addressError: '' })
        }
        this.setState({ address })
    }

    onAmountChanged = (amount: string) => {
        if (Number.isNaN(Number(amount))) {
            this.setState({ amountError: 'Invalid number' })
        } else {
            this.setState({ amountError: '' })
        }
        this.setState({ amount })
    }

    render() {
        return (
            <SafeAreaView style={style.container}>
                <ProgressOverlay
                    isVisible={this.state.paying}
                    error={this.state.paymentError}
                    success={this.state.success}
                />
                <View style={style.header}>
                    <Text style={style.headerTitle}>Transfer</Text>
                </View>
                <ScrollView style={style.content} keyboardDismissMode="on-drag">
                    <Text style={style.label}>Payee</Text>
                    <TextInput
                        style={style.addressField}
                        value={this.state.address}
                        onChangeText={this.onAddressChanged}
                        placeholder="HEX Address"
                        multiline
                        editable
                        numberOfLines={4}
                        maxLength={100}
                    />
                    {(() => {
                        if (this.state.addressError !== '') {
                            return (
                                <Text style={style.error}>
                                    {this.state.addressError}
                                </Text>
                            )
                        }
                    })()}
                    <Text style={style.label}>Amount</Text>
                    <TextInput
                        style={style.amountField}
                        value={this.state.amount}
                        onChangeText={this.onAmountChanged}
                        keyboardType="decimal-pad"
                        editable
                        maxLength={100}
                    />
                    {(() => {
                        if (this.state.amountError !== '') {
                            return (
                                <Text style={style.error}>
                                    {this.state.amountError}
                                </Text>
                            )
                        }
                    })()}
                    <Button
                        buttonStyle={style.button}
                        titleStyle={style.buttonTitle}
                        containerStyle={style.buttonContainer}
                        title="PAY"
                        type="solid"
                        disabled={
                            this.state.addressError !== '' ||
                            this.state.amountError !== ''
                        }
                        loading={this.state.paying}
                        onPress={this.pay}
                    />
                    <Button
                        buttonStyle={style.button}
                        titleStyle={style.buttonTitle}
                        containerStyle={style.buttonContainer}
                        title="SCAN"
                        type="solid"
                        loading={this.state.paying}
                        onPress={() => {
                            Actions.qrcode({
                                onSuccess: (data: any) =>
                                    this.setState({
                                        address: data.content,
                                        amount: data.amount ?? '0',
                                    }),
                            })
                        }}
                    />
                    <Button
                        buttonStyle={style.button}
                        titleStyle={style.buttonTitle}
                        containerStyle={style.buttonContainer}
                        title="SHOW MY CODE"
                        type="solid"
                        loading={this.state.paying}
                        onPress={() => {
                            Actions.mycode()
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

let style = StyleSheet.create({
    container: {
        ...Element.container,
    },
    header: {
        ...Element.header,
    },
    content: {
        marginTop: 20,
        display: 'flex',
        ...Element.spacing,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
    },
    addressField: {
        fontSize: 15,
        minHeight: 60,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        fontFamily: 'RobotoMono-Regular',
    },
    amountField: {
        fontSize: 35,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        minHeight: 60,
        color: 'black',
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    button: {
        marginTop: 20,
        height: 45,
        ...Element.button,
    },
    buttonTitle: {
        ...Element.buttonTitle,
    },
    buttonContainer: {
        ...Element.buttonContainer,
    },
    headerTitle: {
        ...Element.headerTitle,
    },
})
