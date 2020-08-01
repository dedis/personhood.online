import React, { Component } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Button } from 'react-native-elements'
import { StyleSheet, Dimensions, Alert } from 'react-native'
import { Element } from '../styles'
import { Actions } from 'react-native-router-flux'

export class QRCode extends Component<{ onSuccess: (addr: string) => void }> {
    scanner: QRCodeScanner | null = null

    onSuccess = (e: any) => {
        let data = JSON.parse(e.data)
        console.log(data)

        if (
            data.type === 'address' &&
            data.content &&
            data.content.length === 40
        ) {
            this.props.onSuccess(data)
            Actions.pop()
            return
        }

        Alert.alert('Oops', 'Not a valid QR Code', [
            { text: 'Retry', onPress: () => this.scanner?.reactivate() },
        ])
    }

    onCancel = () => {
        Actions.pop()
    }

    render() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess}
                cameraStyle={styles.camera}
                topViewStyle={styles.clear}
                bottomViewStyle={styles.bottom}
                ref={ref => (this.scanner = ref)}
                bottomContent={
                    <Button
                        titleStyle={styles.buttonTitle}
                        title="CANCEL"
                        type="clear"
                        onPress={this.onCancel}
                    />
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    camera: {
        height: Dimensions.get('window').height,
    },
    clear: {
        height: 0,
        flex: 0,
    },
    bottom: {
        flex: 1,
        paddingBottom: 100,
        justifyContent: 'flex-end',
    },
    buttonTitle: {
        ...Element.buttonTitle,
    },
})
