import React, { Component } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import WelcomeLogo from '../assets/images/welcome-logo.svg'
import { Actions } from 'react-native-router-flux'
import { Element } from '../styles'
import { Account } from '../network/account'

export class Welcome extends Component {
    state = {
        loading: false,
    }

    login = () => {
        this.setState({ loading: true })
        Account.load().then(() => {
            this.setState({ loading: false })
            Actions.main()
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <WelcomeLogo width="50%" />
                <Button
                    title="Continue with EPFL"
                    titleStyle={styles.buttonTitle}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    onPress={this.login}
                    loading={this.state.loading}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...Element.container,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#000',
        height: '100%',
    },
    buttonTitle: {
        color: '#FFD562',
        fontSize: 15,
    },
    buttonContainer: {
        width: '65%',
        height: 50,
        borderRadius: 5,
    },
})
