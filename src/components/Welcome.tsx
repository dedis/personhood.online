import React, { Component } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import WelcomeLogo from '../assets/images/welcome-logo.svg'
import { Actions } from 'react-native-router-flux'
import { Element } from '../styles'
import { ProgressOverlay } from './ProgressOverlay'
import { UserAccount } from '../network/tequila'

export class Welcome extends Component {
    state = {
        loading: false,
        error: undefined,
    }

    login = () => {
        Actions.push('epfl-auth', {
            onAuth: this.onAuth,
        })
    }

    onAuth = (data: { token: string }) => {
        Actions.pop()
        this.setState({ loading: true })
        UserAccount.token = data.token
        UserAccount.loadCurrencyAccount()
            .then(() => {
                this.setState({ loading: false })
                Actions.replace('main')
            })
            .catch(error => this.setState({ error: String(error) }))
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ProgressOverlay
                    isVisible={this.state.loading}
                    error={this.state.error}
                />
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
        ...Element.button,
        height: '100%',
    },
    buttonTitle: {
        ...Element.buttonTitle,
    },
    buttonContainer: {
        width: '65%',
        height: 50,
        ...Element.buttonContainer,
    },
})
