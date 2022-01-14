import '../styles/globals.scss';

import { CssBaseline, ThemeProvider } from '@mui/material';

import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';
import { SnackbarWrapper } from '../config/notistack';
import { queryClient } from '../config/queryClient';
import { theme } from '../config/theme';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <Fragment>
            <Head>
                <title>Recipe Book</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <SessionProvider session={session}>
                <ThemeProvider theme={theme}>
                    <SnackbarWrapper>
                        <QueryClientProvider client={queryClient}>
                            <CssBaseline />
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </QueryClientProvider>
                    </SnackbarWrapper>
                </ThemeProvider>
            </SessionProvider>
        </Fragment>
    );
}

export default MyApp;
