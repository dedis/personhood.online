import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Overlay, Text } from 'react-native-elements'
import { Element } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'

interface ProgressOverlayProps {
    isVisible: boolean
    error?: string | undefined
    success?: string | undefined
}

export class ProgressOverlay extends Component<ProgressOverlayProps> {
    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                overlayStyle={styles.container}
            >
                <View style={styles.content}>
                    {(() => {
                        if (this.props.error) {
                            return (
                                <Icon
                                    name="exclamation-circle"
                                    size={50}
                                    color="red"
                                />
                            )
                        }
                        if (this.props.success) {
                            return (
                                <Icon
                                    name="check-circle"
                                    size={50}
                                    color="green"
                                />
                            )
                        }
                        return (
                            <ActivityIndicator
                                size="large"
                                color={Element.primaryColor}
                            />
                        )
                    })()}
                    <Text style={styles.title}>
                        {(() => {
                            if (this.props.error) {
                                return this.props.error
                            }
                            if (this.props.success) {
                                return this.props.success
                            }
                            return 'Processing'
                        })()}
                    </Text>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        minWidth: '50%',
        maxWidth: '80%',
        minHeight: '20%',
        maxHeight: '60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    title: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})
