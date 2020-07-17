import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Linking } from 'react-native'
import { Button } from 'react-native-elements'
import WelcomeLogo from '../assets/images/welcome-logo.svg'
import { Actions } from 'react-native-router-flux'
import { Element } from '../styles'
import { ProgressOverlay } from './ProgressOverlay'
import { UserAccount } from '../network/tequila'
import { parseUrl } from 'query-string'

export class Welcome extends Component {
    state = {
        loading: false,
        error: undefined,
    }

    componentDidMount() {
        Linking.addEventListener('url', this.onAuth)
    }

    componentWillUnmount() {
        Linking.removeAllListeners('url')
    }

    login = () => {
        Linking.openURL('http://epflcoin.cothority.net/oauth2/auth')
    }

    onAuth = (event: { url: string }) => {
        if (!event.url) {
            this.setState({ error: 'Invalid Auth Info' })
            setTimeout(() => {
                this.setState({ error: undefined })
            }, 3000)
        }

        let data = parseUrl(event.url)
        console.log(data)

        this.setState({ loading: true })
        UserAccount.token = data.query.access_token as string
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
