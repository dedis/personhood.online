import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes'
import { StyleSheet } from 'react-native'
import { Account } from '../network/account'

type PropTypes = {
    onAuth: (data: object) => void
}

export class Auth extends Component<PropTypes> {
    script = `
        window.onload = function () {
            if (window.auth) {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify(window.auth)
                )
            }
        }
    `

    authURL = 'https://epflcoin.cothority.net/auth/login?addr='

    onMessage = (event: WebViewMessageEvent) => {
        this.props.onAuth(JSON.parse(event.nativeEvent.data))
    }

    render() {
        return (
            <WebView
                containerStyle={styles.webview}
                style={styles.webview}
                source={{
                    uri: this.authURL + Account.address,
                }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                injectedJavaScript={this.script}
                onMessage={this.onMessage}
            />
        )
    }
}

const styles = StyleSheet.create({
    webview: {
        width: '100%',
        height: '100%',
    },
})
