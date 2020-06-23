import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

type PropType = {
    navigation: {
        state: {
            key: string
        }
        isFocused(): boolean
    }
}

export class TabIcon extends Component<PropType> {
    render() {
        let icon = icons[this.props.navigation.state.key]
        let selected = this.props.navigation.isFocused()
        return (
            <Image
                style={style.icon}
                source={selected ? icon.selected : icon.normal}
            />
        )
    }
}

let icons: { [key: string]: any } = {
    home: {
        normal: require('../assets/images/home.png'),
        selected: require('../assets/images/home-selected.png'),
    },
    profile: {
        normal: require('../assets/images/profile.png'),
        selected: require('../assets/images/profile-selected.png'),
    },
}

let style = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
    },
})
