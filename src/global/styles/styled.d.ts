import 'styled-components'
import theme from './thema'

declare module 'styled-components' {
    type ThemeType = typeof theme

    export interface DefaultTheme extends ThemeType {}
}