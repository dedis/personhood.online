import React, { Component } from 'react'
import { SafeAreaView, View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign'
import Storage from '@react-native-community/async-storage'
import { Element } from '../styles'
import { Actions } from 'react-native-router-flux'
import { UserAccount } from '../network/tequila'

export class Settings extends Component {
    state = {
        errorMsg: null,
        nonce: UserAccount.bankAccount?.nonce,
    }

    componentDidMount() {
        Storage.getItem('transaction-last-error').then(errorMsg => {
            this.setState({ errorMsg })
        })
    }

    inc = () => {
        UserAccount.bankAccount?.incNonce()
        this.setState({ nonce: UserAccount.bankAccount?.nonce })
    }

    dec = () => {
        Alert.alert('Oops...', 'decrease nonce number now disabled.', [
            { text: 'OK' },
        ])
    }

    render() {
        return (
            <SafeAreaView style={style.container}>
                <ScrollView>
                    <View style={style.item}>
                        <Text style={style.itemLabel}>Account Nonce</Text>
                        <View style={style.itemContainer}>
                            <View style={style.controlsContainer}>
                                <Text style={style.nonce}>
                                    {this.state.nonce}
                                </Text>
                                <Button
                                    icon={<Icon name="minuscircle" size={25} />}
                                    type="clear"
                                    onPress={this.dec}
                                />
                                <Button
                                    icon={<Icon name="pluscircle" size={25} />}
                                    type="clear"
                                    onPress={this.inc}
                                />
                            </View>
                            {(() => {
                                if (this.state.errorMsg !== null) {
                                    return (
                                        <Text style={style.last}>
                                            {this.state.errorMsg}
                                        </Text>
                                    )
                                }
                            })()}
                            <Text style={style.desc}>
                                Tune this value only when transaction failed
                            </Text>
                        </View>
                    </View>
                    <View style={style.item}>
                        <Button
                            title="SIGN OUT"
                            buttonStyle={style.button}
                            titleStyle={style.buttonTitle}
                            containerStyle={style.buttonContainer}
                            onPress={() => {
                                Alert.alert(
                                    'Sign Out',
                                    'This operation will clear all user account data, and it CANNOT be recovered. Are you sure?',
                                    [
                                        {
                                            text: 'Mistouch',
                                            style: 'cancel',
                                        },
                                        {
                                            text: "I'm Sure",
                                            style: 'destructive',
                                            onPress: () => {
                                                UserAccount.clear()
                                                Actions.replace('welcome')
                                            },
                                        },
                                    ],
                                )
                            }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    container: {
        ...Element.container,
    },
    item: {
        marginTop: 20,
        ...Element.spacing,
        ...Element.sectionLabel,
    },
    itemLabel: {
        marginBottom: 5,
        ...Element.sectionLabel,
    },
    itemContainer: {
        ...Element.card,
    },
    controlsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nonce: {
        flexGrow: 2,
        fontSize: 20,
        fontWeight: '600',
    },
    desc: {
        marginTop: 10,
        color: 'grey',
    },
    last: {
        color: 'red',
    },
    button: {
        ...Element.button,
    },
    buttonTitle: {
        ...Element.buttonTitle,
    },
    buttonContainer: {
        ...Element.buttonContainer,
    },
})
