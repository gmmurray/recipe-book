import { Field, Form } from 'react-final-form';
import { Fragment, useCallback } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import {
    showErrorSnackbar,
    showSuccessSnackbar,
} from '../../../config/notistack';

import { Box } from '@mui/system';
import { Category } from '../../../entities/Category';
import { CredentialUser } from '../../../entities/CredentialUser';
import { LoadingButton } from '@mui/lab';
import { isRequired } from '../../../util/validation';
import { useCreateCategory } from '../../../lib/queries/categoryQueries';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

const NewCategory = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { data: session } = useSession();

    const createMutation = useCreateCategory();

    const onCreate = useCallback(
        async (data: Partial<Category>) => {
            createMutation.mutate(
                { ...data, userId: (session?.user as CredentialUser)._id },
                {
                    onSuccess: async result => {
                        showSuccessSnackbar(
                            enqueueSnackbar,
                            'Category created',
                        );
                        router.push(`/categories/${result._id}`);
                    },
                    onError: async () =>
                        showErrorSnackbar(
                            enqueueSnackbar,
                            'Error creating category',
                        ),
                },
            );
        },
        [createMutation, enqueueSnackbar, router, session?.user],
    );
    return (
        <Fragment>
            <Typography variant="h3">Add category</Typography>
            <Form
                onSubmit={(data: Partial<Category>) => onCreate(data)}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ my: 2 }}>
                            <Field
                                name="name"
                                validate={isRequired('Name')}
                                render={({ input, meta }) => (
                                    <TextField
                                        {...input}
                                        required
                                        label="Name"
                                        variant="outlined"
                                        error={meta.error && meta.touched}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                loading={createMutation.isLoading}
                            >
                                Save
                            </LoadingButton>
                        </Box>
                    </form>
                )}
            />
        </Fragment>
    );
};

export default NewCategory;
