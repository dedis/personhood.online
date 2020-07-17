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
import { InteractionManager, StatusBar } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import { UserAccount } from '../network/tequila'
import { Auth } from './Auth'

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
                    </Modal>
                </Router>
            </ThemeProvider>
        )
    }
}

class Base extends Component {
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            UserAccount.init()
                .then(() => {
                    Actions.replace('main')
                })
                .catch(e => {
                    console.log(e)
                    Actions.push('welcome')
                })
        })
    }

    render() {
        return <></>
    }
}

// const stateHandler = (_1: any, _2: any, action: any) => {
//     console.log('onStateChange: ACTION:', action)
// }

let theme = {
    Text: {
        style: {
            fontFamily: 'Avenir Next',
            letterSpacing: -0.25,
        },
    },
    Button: {
        titleStyle: {
            fontFamily: 'Avenir Next',
            letterSpacing: -0.5,
        },
    },
}
