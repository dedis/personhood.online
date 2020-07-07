import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import { Text, Button, Overlay } from 'react-native-elements'
import { Element } from '../styles'
// import Icon from 'react-native-vector-icons/FontAwesome5'
import { Account } from '../network/account'

export class Exchange extends Component {
    state = {
        address: '',
        addressError: '',
        amount: '0',
        amountError: '',
        paying: false,
    }

    pay = () => {
        const { address, amount } = this.state
        if (address.length === 40 && !Number.isNaN(Number(amount))) {
            this.setState({ paying: true })
            Account.transferTo(address, Number(amount))
                .then(() => {
                    this.setState({ paying: false })
                })
                .catch(reason => {
                    this.setState({ paying: false })
                    console.log(reason)
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
                <Overlay
                    isVisible={this.state.paying}
                    overlayStyle={style.processingContainer}
                >
                    <View>
                        <ActivityIndicator
                            size="large"
                            color={Element.primaryColor}
                        />
                        <Text style={style.processingTitle}>Processing</Text>
                    </View>
                </Overlay>
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
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    button: {
        marginTop: 20,
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
    processingContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '50%',
        height: '20%',
    },
    processingTitle: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        fontWeight: '500',
    },
})
