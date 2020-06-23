declare module '*.svg' {
    import { SvgProps } from 'react-native-svg'
    const value: React.FC<SvgProps>
    export default value
}

declare module '*.png'
