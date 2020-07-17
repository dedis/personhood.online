import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes'
import { StyleSheet } from 'react-native'

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

    authURL = 'http://epflcoin.cothority.net/oauth2/auth'

    onMessage = (event: WebViewMessageEvent) => {
        let data = JSON.parse(event.nativeEvent.data)
        console.log('auth info: ' + JSON.stringify(data))
        this.props.onAuth({
            token: data.access_token,
        })
    }

    render() {
        return (
            <WebView
                containerStyle={styles.webview}
                style={styles.webview}
                source={{
                    uri: this.authURL,
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
