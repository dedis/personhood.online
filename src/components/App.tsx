import React, { Component } from 'react'
import {
    Router,
    Stack,
    Scene,
    Modal,
    Tabs,
    Actions,
} from 'react-native-router-flux'

import { Welcome } from './Welcome'
import { Home } from './Home'
import { Exchange } from './Exchange'
import { Profile } from './Profile'
import { Settings } from './Settings'
import { TabIcon } from './TabIcon'
import { InteractionManager, StatusBar, Platform } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { UserAccount } from '../network/tequila'
import { Auth } from './Auth'
import { ProgressOverlay } from './ProgressOverlay'
import { QRCode } from './QRCode'
import { MyCode } from './MyCode'

export class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StatusBar barStyle="dark-content" />
                <Router>
                    <Modal key="root">
                        <Scene initial hideNavBar component={Base} />
                        <Stack hideNavBar key="welcome">
                            <Scene component={Welcome} />
                            <Scene
                                key="epfl-auth"
                                component={Auth}
                                hideNavBar={false}
                                title="EPFL Tequila"
                            />
                        </Stack>
                        <Scene key="main" hideNavBar>
                            <Tabs key="tabs" showLabel={false}>
                                <Stack key="home" title="Home" icon={TabIcon}>
                                    <Scene hideNavBar component={Home} />
                                </Stack>
                                <Stack
                                    key="exchange"
                                    title="Exchange"
                                    icon={TabIcon}
                                >
                                    <Scene hideNavBar component={Exchange} />
                                    <Scene
                                        key="mycode"
                                        title="My Code"
                                        component={MyCode}
                                    />
                                </Stack>
                                <Stack
                                    key="profile"
                                    title="Profile"
                                    icon={TabIcon}
                                >
                                    <Scene hideNavBar component={Profile} />
                                    <Scene
                                        key="settings"
                                        title="Settings"
                                        component={Settings}
                                    />
                                </Stack>
                            </Tabs>
                        </Scene>
                        <Scene key="qrcode" hideNavBar component={QRCode} />
                    </Modal>
                </Router>
            </ThemeProvider>
        )
    }
}

class Base extends Component {
    state = {
        loading: false,
        text: undefined,
        error: undefined,
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ loading: true, text: 'Loading...' })
            UserAccount.init((text: string) => this.setState({ text }))
                .then(() => {
                    this.setState({ loading: false })
                    Actions.replace('main')
                })
                .catch(e => {
                    console.log(e)
                    this.setState({ loading: false })
                    Actions.replace('welcome')
                })
        })
    }

    render() {
        return (
            <ProgressOverlay
                isVisible={this.state.loading}
                text={this.state.text}
                error={this.state.error}
            />
        )
    }
}

// const stateHandler = (_1: any, _2: any, action: any) => {
//     console.log('onStateChange: ACTION:', action)
// }

let theme = {
    Text: {
        style: {
            fontFamily:
                Platform.OS === 'android' ? 'Montserrat-Medium' : 'Avenir Next',
            letterSpacing: -0.25,
        },
    },
    Button: {
        titleStyle: {
            fontFamily:
                Platform.OS === 'android' ? 'Montserrat-Medium' : 'Avenir Next',
            letterSpacing: -0.5,
        },
    },
}
