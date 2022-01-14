import {
    Box,
    Button,
    Container,
    Grid,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    CreateCredentialUser,
    CredentialUser,
} from '../entities/CredentialUser';
import { Field, Form } from 'react-final-form';
import { LoadingButton, Masonry } from '@mui/lab';
import {
    MINIMUM_PASSWORD_LENGTH,
    MINIMUM_USERNAME_LENGTH,
} from '../lib/constants/auth';
import {
    composeValidators,
    isMatchingValue,
    isMinLength,
    isRequired,
} from '../util/validation';
import { showErrorSnackbar, showSuccessSnackbar } from '../config/notistack';
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { FormApi } from 'final-form';
import Image from 'next/image';
import { useCreateCredentialUser } from '../lib/queries/credentialUsers';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const Welcome = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [isRegister, setIsRegister] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [router, session]);

    useEffect(() => {
        if (router.query.register === 'true') {
            setIsRegister(true);
        }
    }, [router.query.register]);

    useEffect(() => {
        if (router.query.error && router.query.error === 'CredentialsSignin') {
            showErrorSnackbar(
                enqueueSnackbar,
                'Unable to log you in. Please check your username and password',
            );
        }
    }, [enqueueSnackbar, router.query.error]);

    const registerMutation = useCreateCredentialUser();

    const onLogin = useCallback((data: CredentialUser) => {
        signIn('credentials', { ...data });
    }, []);

    const onRegister = useCallback(
        async (data: CreateCredentialUser) => {
            registerMutation.mutate(data, {
                onSuccess: async () => {
                    showSuccessSnackbar(
                        enqueueSnackbar,
                        'Successfully registered',
                    );
                    onLogin(data);
                },
                onError: async () =>
                    showErrorSnackbar(enqueueSnackbar, 'Error registering'),
            });
        },
        [enqueueSnackbar, onLogin, registerMutation],
    );

    const handleToggle = useCallback((form: FormApi<any, Partial<any>>) => {
        setIsRegister(state => !state);
        form.restart();
    }, []);

    return (
        <Masonry
            columns={{ xs: 1, sm: 2 }}
            spacing={0}
            sx={{ minHeight: '100vh' }}
            component={Paper}
            elevation={5}
        >
            <Grid
                component={Paper}
                square
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: { xs: '40vh', sm: '100vh' },
                }}
            >
                <Image
                    src="/logo.png"
                    height={200}
                    width={200}
                    alt="recipe book logo"
                />
            </Grid>
            <Grid
                component={Paper}
                square
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    backgroundColor: 'primary.main',
                    height: { xs: '60vh', sm: '100vh' },
                }}
            >
                <Stack
                    textAlign="center"
                    spacing={3}
                    maxWidth="75%"
                    minHeight="75%"
                    padding={3}
                    component={Paper}
                >
                    <Typography variant="h3">
                        {isRegister ? 'Register' : 'Sign in'}
                    </Typography>
                    <Form
                        onSubmit={(data: any) =>
                            isRegister
                                ? onRegister(data as CreateCredentialUser)
                                : onLogin(data as CredentialUser)
                        }
                        render={({ handleSubmit, values, form }) => (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="username"
                                    validate={
                                        !isRegister
                                            ? undefined
                                            : composeValidators(
                                                  isRequired('Username'),
                                                  isMinLength(
                                                      'Username',
                                                      MINIMUM_USERNAME_LENGTH,
                                                  ),
                                              )
                                    }
                                    render={({ input, meta }) => {
                                        const isError =
                                            meta.error && meta.touched;
                                        const helperText =
                                            meta.touched && meta.error
                                                ? meta.error
                                                : `Minimum username length is ${MINIMUM_USERNAME_LENGTH}`;
                                        const isSuccess =
                                            isRegister &&
                                            !meta.error &&
                                            meta.touched;
                                        const className = isSuccess
                                            ? 'success-input'
                                            : undefined;

                                        return (
                                            <TextField
                                                {...input}
                                                required
                                                label="Username"
                                                fullWidth
                                                variant="outlined"
                                                error={isRegister && isError}
                                                helperText={
                                                    isRegister && helperText
                                                }
                                                sx={{
                                                    my: 1,
                                                }}
                                                className={className}
                                                InputProps={{
                                                    endAdornment: isSuccess && (
                                                        <InputAdornment position="end">
                                                            <CheckIcon color="success" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    className,
                                                }}
                                            />
                                        );
                                    }}
                                />
                                <Field
                                    name="password"
                                    validate={
                                        !isRegister
                                            ? undefined
                                            : composeValidators(
                                                  isRequired('Password'),
                                                  isMinLength(
                                                      'Password',
                                                      MINIMUM_PASSWORD_LENGTH,
                                                  ),
                                              )
                                    }
                                    render={({ input, meta }) => {
                                        const isError =
                                            meta.error && meta.touched;
                                        const helperText =
                                            meta.touched && meta.error
                                                ? meta.error
                                                : `Minimum password length is ${MINIMUM_USERNAME_LENGTH}`;
                                        const isSuccess =
                                            isRegister &&
                                            !meta.error &&
                                            meta.touched;
                                        const className = isSuccess
                                            ? 'success-input'
                                            : undefined;

                                        return (
                                            <TextField
                                                {...input}
                                                required
                                                type="password"
                                                label="Password"
                                                fullWidth
                                                variant="outlined"
                                                error={isRegister && isError}
                                                helperText={
                                                    isRegister && helperText
                                                }
                                                sx={{ my: 1 }}
                                                className={className}
                                                InputProps={{
                                                    endAdornment: isSuccess && (
                                                        <InputAdornment position="end">
                                                            <CheckIcon color="success" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    className,
                                                }}
                                            />
                                        );
                                    }}
                                />
                                {isRegister && (
                                    <Field
                                        name="confirmPassword"
                                        validate={isMatchingValue(
                                            'Passwords',
                                            values.password,
                                        )}
                                        render={({ input, meta }) => (
                                            <TextField
                                                {...input}
                                                type="password"
                                                label="Confirm password"
                                                fullWidth
                                                variant="outlined"
                                                error={
                                                    meta.error && meta.touched
                                                }
                                                helperText={
                                                    meta.touched && meta.error
                                                }
                                                sx={{ my: 1 }}
                                                className={
                                                    !meta.error && meta.touched
                                                        ? 'success-input'
                                                        : undefined
                                                }
                                                InputProps={{
                                                    endAdornment: !meta.error &&
                                                        meta.touched && (
                                                            <InputAdornment position="end">
                                                                <CheckIcon color="success" />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                                InputLabelProps={{
                                                    className:
                                                        !meta.error &&
                                                        meta.touched
                                                            ? 'success-input'
                                                            : undefined,
                                                }}
                                            />
                                        )}
                                    />
                                )}
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    loading={registerMutation.isLoading}
                                >
                                    Submit
                                </LoadingButton>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={() => handleToggle(form)}
                                >
                                    {isRegister
                                        ? 'Login instead'
                                        : 'Create new account'}
                                </Button>
                            </form>
                        )}
                    />
                </Stack>
            </Grid>
        </Masonry>
    );
};

export default Welcome;
