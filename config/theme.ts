import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {}
    // allow configuration using `createTheme`
    interface ThemeOptions {}
}

export const theme = responsiveFontSizes(
    createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#59C3C3',
            },
            secondary: {
                main: '#F05365',
            },
        },
    }),
);
