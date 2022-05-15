import { Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export const COLORS = {
    // base colors
    primary: '#379905', // light green
    secondary: '#CDCDCD', // gray

    // colors
    black: '#1E1E1E',
    white: '#FFF',

    lightGray: '#F5F5F5',
    transparent: 'transparent',
    darkgray: '#898C95',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 24,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,

    // app dimensions
    height,
    width
};

export const FONTS = {
    largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 56 },
    h1: { fontSizes: SIZES.h1, lineHeight: 36 },
    h2: { fontSizes: SIZES.h2, lineHeight: 30 },
    h3: { fontSizes: SIZES.h3, lineHeight: 22 },
    h4: { fontSizes: SIZES.h4, lineHeight: 22 },
    body1: { fontSizes: SIZES.body1, lineHeight: 36 },
    body2: { fontSizes: SIZES.body2, lineHeight: 30 },
};

const appTheme = { COLORS, FONTS, SIZES };

export default appTheme;