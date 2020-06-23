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
import { Profile } from './Profile'
import { TabIcon } from './TabIcon'
import { InteractionManager } from 'react-native'
import { ThemeProvider } from 'react-native-elements'

export class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <Modal key="root">
                        <Scene initial hideNavBar component={Base} />
                        <Scene hideNavBar key="welcome" component={Welcome} />
                        <Scene key="main" hideNavBar>
                            <Tabs key="tabs" showLabel={false}>
                                <Stack key="home" title="Home" icon={TabIcon}>
                                    <Scene hideNavBar component={Home} />
                                </Stack>
                                <Stack
                                    key="profile"
                                    title="Profile"
                                    icon={TabIcon}
                                >
                                    <Scene hideNavBar component={Profile} />
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
            Actions.welcome()
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
