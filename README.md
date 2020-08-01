# POPCOIN

POPCOIN is an appliation for a currency which has the mechanism featured by demurrage and universal basic income (in the future) a global currency.

Now this is only a demo version with restricted features. Creating a new account with EPFL Tequila authentication, receiving and sending coins to others.

# How To Build

## Environment

Firstly, prepare react native dependencies:
```shell
yarn

# or

npm install
```

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
