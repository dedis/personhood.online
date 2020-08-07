# POPCOIN

POPCOIN is an appliation for a currency which has the mechanism featured by demurrage and universal basic income (in the future) a global currency.

Now this is only a demo version with restricted features. Creating a new account with EPFL Tequila authentication, receiving and sending coins to others.

# How To Build

## Environment

### Node.js

For windows user, you can download Node.js installer (.msi) [here](https://nodejs.org/en/download/current/).

For macOS user, you can also download Node.js from the link above or use [Homebrew](https://brew.sh/) (package manager for macOS):
```shell
brew install node
```

For installing the Node.js on Linux, please check [the document here](https://github.com/nodesource/distributions/blob/master/README.md) for different distributions of Linux.

### React Native and Dependencies

After clone this project by the commands below:
```shell
# Get the repo
git clone git@github.com:dedis/personhood.online.git

# Switch to this branch
git fetch
git checkout rn-dev

# Change directory to the project
cd ./personhood.online
```

Then prepare react native dependencies:
```shell
yarn

# or using the default package manager

npm install
```

If you not familiar with `yarn`. please check [here](https://yarnpkg.com/getting-started). Both package manager `yarn` or `npm` works for this project.

For both iOS and Android, they have their own dependencies for supporting react native packages.

## iOS

> It can only run on macOS

Ensure that you already have Xcode and CocoaPods installed on your macOS. Then run:
```shell
npx pod-install ios

# or
cd ./ios
pod install 
```

The script below will build the app and run it in the simulator. It will also automatically start the metro daemon for compiling project dynamically.
```shell
yarn ios
```

## Android

Similarly, the script below will run the app in an Android simulator. You also need to have Andriod Studio and gradle installed first.
```shell
yarn android
```

To make a release build:
```shell
cd ./android
./gradlew assembleRelease
```

Then you will find the APK in `./android/app/build/outputs/apk/release/`

## Build Contract

By running the script below, you will get the ABI and bytecode of the POPCOIN contract:
```shell
solc -o . --bin --abi ./contract/Popcoin.sol
```
