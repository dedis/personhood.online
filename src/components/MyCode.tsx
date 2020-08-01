import React, { Component } from 'react'
import { Text, Avatar } from 'react-native-elements'
import { SafeAreaView, View, StyleSheet, Dimensions } from 'react-native'
import { UserAccount } from '../network/tequila'
import QRCode from 'react-native-qrcode-svg'
import { Element } from '../styles'

export class MyCode extends Component {
    render() {
        return (
            <SafeAreaView style={styles.view}>
                <View style={styles.header}>
                    <Avatar
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        size={40}
                        source={{
                            uri: UserAccount.profile?.avatar,
                        }}
                    />
                    <Text style={styles.name}>
                        {UserAccount.profile?.firstName ?? ''}
                    </Text>
                </View>
                <View style={styles.qrcode}>
                    <QRCode
                        value={JSON.stringify({
                            type: 'address',
                            content: UserAccount.bankAccount?.address,
                        })}
                        size={Dimensions.get('window').width * 0.6}
                    />
                    <Text style={styles.address}>Scan to send me coins :)</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    name: {
        ...Element.headerTitle,
        marginLeft: 15,
        fontSize: 20,
    },
    qrcode: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
    },
    address: {
        marginTop: 15,
    },
})
