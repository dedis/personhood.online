/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config')

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig()
    return {
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: false,
                },
            }),
            babelTransformerPath: require.resolve(
                'react-native-svg-transformer',
            ),
        },
        resolver: {
            assetExts: assetExts.filter(ext => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg'],
            extraNodeModules: {
                crypto: require.resolve('react-native-crypto'),
                stream: require.resolve('stream-browserify'),
                vm: require.resolve('vm-browserify'),
                // url: require.resolve('whatwg-url'),
                // http: require.resolve('stream-http'),
                // https: require.resolve('https-browserify'),
                // path: require.resolve('react-native-path'),
                // tls: require.resolve('react-native-tls'),
                // net: require.resolve('react-native-tcp-socket'),
                // fs: require.resolve('react-native-fs'),
                // os: require.resolve('os-browserify/browser.js'),
            },
        },
    }
})()
