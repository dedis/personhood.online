import React, { Component } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { Text, Avatar, Button } from 'react-native-elements'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { Element } from '../styles'

export class Profile extends Component {
    render() {
        return (
            <SafeAreaView style={style.container}>
                <View style={style.header}>
                    <View>
                        <Text style={style.name}>Teddy Roberts</Text>
                        <View style={style.avatarContainer}>
                            <Avatar
                                rounded
                                size={30}
                                source={{
                                    uri:
                                        'https://randomuser.me/api/portraits/men/32.jpg',
                                }}
                            />
                            <Text style={style.accountLabel}>
                                Personal Account
                            </Text>
                        </View>
                    </View>
                    <Button
                        type="clear"
                        icon={<MIcon name="settings" size={20} />}
                    />
                </View>
                <View style={style.content}>
                    <View style={style.item}>
                        <Text style={style.itemLabel}>Email</Text>
                        <Text style={style.itemContent}>
                            teddy.roberts@epfl.ch
                        </Text>
                    </View>
                    <View style={style.item}>
                        <Text style={style.itemLabel}>Wallet Address</Text>
                        <Text style={style.itemContent}>
                            1rmj3NjgDbCqRG7P2Be73xxwXzaW63ycm
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

let style = StyleSheet.create({
    container: {
        ...Element.container,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '8%',
        marginTop: 30,
    },
    name: {
        fontWeight: '600',
        fontSize: 30,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountLabel: {
        fontWeight: '600',
        color: '#666',
        marginLeft: 10,
    },
    content: {
        display: 'flex',
        marginHorizontal: '8%',
        marginTop: 30,
    },
    item: {
        marginVertical: 10,
        ...Element.card,
    },
    itemLabel: {
        color: '#666',
    },
    itemContent: {
        fontFamily: 'RobotoMono-Regular',
        letterSpacing: 0,
    },
})
