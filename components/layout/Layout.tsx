import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { FC, Fragment, useEffect, useState } from 'react';
import { RouteMapRoute, routeMap } from '../../config/routes';

import CenteredCircularProgress from '../shared/CenteredCircularProgress';
import Navbar from './Navbar';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Layout: FC = ({ children }) => {
    const { pathname, push } = useRouter();
    const { data: session, status } = useSession();
    const [currentRoute, setCurrentRoute] = useState<RouteMapRoute>(
        routeMap.default,
    );
    const sessionIsLoading = status === 'loading';

    useEffect(() => {
        const route = routeMap[pathname] ?? routeMap.default;
        setCurrentRoute(route);
    }, [pathname]);

    useEffect(() => {
        if (!sessionIsLoading && !session && pathname !== '/welcome') {
            push('/welcome');
        }
    }, [pathname, push, session, sessionIsLoading]);

    useEffect(() => {
        document.title = currentRoute.pageTitle;
    }, [currentRoute]);

    if (sessionIsLoading) {
        return <CenteredCircularProgress minHeight="calc(100vh - 64px)" />;
    }

    if (!session) {
        return <Fragment>{children}</Fragment>;
    }

    const isPageNotFound = pathname === '/404';

    return (
        <Fragment>
            <Navbar isAuthenticated={!!session} isLoading={sessionIsLoading} />
            {!isPageNotFound && (
                <Container maxWidth="xl" sx={{ py: 2 }}>
                    {currentRoute.isDefault ? (
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {currentRoute.title}
                        </Typography>
                    ) : (
                        <Breadcrumbs>
                            {(currentRoute.breadcrumbs ?? []).map(r => (
                                <NextLink
                                    key={r.pathname}
                                    href={r.pathname}
                                    passHref
                                >
                                    <Link
                                        underline="hover"
                                        color="text.secondary"
                                    >
                                        <Typography variant="subtitle1">
                                            {r.title}
                                        </Typography>
                                    </Link>
                                </NextLink>
                            ))}
                            <Typography
                                color="text.primary"
                                variant="subtitle1"
                            >
                                {currentRoute.title}
                            </Typography>
                        </Breadcrumbs>
                    )}
                </Container>
            )}
            <Container maxWidth="xl" sx={{ pb: 2 }}>
                {children}
            </Container>
        </Fragment>
    );
};

export default Layout;
