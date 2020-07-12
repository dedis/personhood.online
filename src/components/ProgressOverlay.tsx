import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { Overlay, Text } from 'react-native-elements'
import { Element } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5'

interface ProgressOverlayProps {
    isVisible: boolean
    error: string | undefined
}

export class ProgressOverlay extends Component<ProgressOverlayProps> {
    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                overlayStyle={styles.processingContainer}
            >
                <View>
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
                        return (
                            <ActivityIndicator
                                size="large"
                                color={Element.primaryColor}
                            />
                        )
                    })()}
                    <Text style={styles.processingTitle}>
                        {this.props.error ? this.props.error : 'Processing'}
                    </Text>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    processingContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '50%',
        height: '20%',
    },
    processingTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
    },
})
