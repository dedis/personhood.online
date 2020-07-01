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

import { Config } from '../lib/config'
import { EvmAccount, EvmContract } from '../lib/bevm'

async function init(): Promise<string> {
    console.log('Invoked init')
    const config = await Config.init()
    console.log('Got config')

    const account = EvmAccount.deserialize({
        name: 'test',
        nonce: 13,
        privateKey:
            'c007f02a9cb5d34ac4c4cffe1db396e1b0ae0e1f1d2bc59a2a18d1e1b20da548',
    })

    const contract = EvmContract.deserialize({
        abi:
            '[{"constant":false,"inputs":[{"name":"candies","type":"uint256"}],"name":"eatCandy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRemainingCandies","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_candies","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]',
        addresses: [
            '336d456aada38ab67ba4c21830fdf8bc62cfbacd',
            '96a648050e0e98fd710e073ecd99f7483587eede',
        ],
        bytecode:
            '608060405234801561001057600080fd5b506040516101c03803806101c08339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600281905550806000819055506000600181905550506101568061006a6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063a1ff2f521461003b578063ea319f2814610069575b600080fd5b6100676004803603602081101561005157600080fd5b8101908080359060200190929190505050610087565b005b610071610118565b6040518082815260200191505060405180910390f35b6000548111156100ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260058152602001807f6572726f7200000000000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b8060005403600081905550806001540160018190555050565b6000805490509056fea265627a7a72305820898e18179551d21e54e9eec212065e348ae08b6900e2dc57a2fbc6f7dc69662864736f6c634300050a0032',
        name: 'Candy',
    })

    console.log('Invoked bevmRPC')
    const response = await config.bevmRPC.call(
        config.byzcoinRPC.genesisID,
        config.rosterToml,
        config.bevmRPC.id,
        account,
        contract,
        'getRemainingCandies',
        [],
    )

    return response
}

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

        init().then(res => console.log(res))
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
