import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import { FC, Fragment, useCallback, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { navbarRoutes } from '../../config/routes';

type NavbarProps = {
    isAuthenticated: boolean;
    isLoading: boolean;
};

const Navbar: FC<NavbarProps> = ({ isAuthenticated, isLoading }) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorElNav(event.currentTarget);
        },
        [],
    );
    const handleOpenUserMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorElUser(event.currentTarget);
        },
        [],
    );

    const handleCloseNavMenu = useCallback(() => {
        setAnchorElNav(null);
    }, []);

    const handleCloseUserMenu = useCallback(() => {
        setAnchorElUser(null);
    }, []);

    const handleSignOut = useCallback(() => {
        handleCloseUserMenu();
        signOut();
    }, [handleCloseUserMenu]);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        Recipe Book
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{ pl: 0 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={!!anchorElNav}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {navbarRoutes.map(({ title, pathname }) => (
                                <Link key={pathname} href={pathname} passHref>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">
                                            {title}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Recipe Book
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {navbarRoutes.map(({ title, pathname }) => (
                            <Link key={pathname} href={pathname} passHref>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                    }}
                                >
                                    {title}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {!isLoading && isAuthenticated && (
                            <Fragment>
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar />
                                </IconButton>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={!!anchorElUser}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleSignOut}>
                                        <Typography
                                            variant="button"
                                            color="primary"
                                        >
                                            Logout
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Fragment>
                        )}
                        {!isLoading && !isAuthenticated && (
                            <Button onClick={() => signIn()}>login</Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
