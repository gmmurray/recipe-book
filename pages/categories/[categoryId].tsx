import { Box, Button, TextField, Typography } from '@mui/material';
import { Field, Form } from 'react-final-form';
import { Fragment, useCallback } from 'react';
import { showErrorSnackbar, showSuccessSnackbar } from '../../config/notistack';
import {
    useDeleteCategory,
    useGetCategory,
    useUpdateCategory,
} from '../../lib/queries/categoryQueries';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Category } from '../../entities/Category';
import ContentWithStatus from '../../components/shared/ContentWithStatus';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { isRequired } from '../../util/validation';
import { resolveQueryParam } from '../../util/resolveQueryParam';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const ViewCategory = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const categoryId = resolveQueryParam(router.query, 'categoryId');

    const { data: category, isLoading: categoryIsLoading } =
        useGetCategory(categoryId);

    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const onUpdate = useCallback(
        async (data: Category) => {
            updateMutation.mutate(data, {
                onSuccess: async () =>
                    showSuccessSnackbar(enqueueSnackbar, 'Category updated'),
                onError: async () =>
                    showErrorSnackbar(
                        enqueueSnackbar,
                        'Error creating category',
                    ),
            });
        },
        [enqueueSnackbar, updateMutation],
    );

    const handleDelete = useCallback(
        async (id: string | null) => {
            if (!id) {
                return;
            }
            deleteMutation.mutate(id, {
                onSuccess: async () => {
                    showSuccessSnackbar(enqueueSnackbar, 'Category deleted');
                    router.push('/categories');
                },
                onError: async () =>
                    showErrorSnackbar(
                        enqueueSnackbar,
                        'Error deleting category',
                    ),
            });
        },
        [deleteMutation, enqueueSnackbar, router],
    );

    return (
        <Fragment>
            <Box display="flex" alignItems="center">
                <Typography variant="h3">View category</Typography>
                <Link href="/categories" passHref>
                    <Button
                        sx={{ ml: 'auto' }}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to list
                    </Button>
                </Link>
            </Box>
            <ContentWithStatus
                loading={categoryIsLoading}
                empty={!category}
                name="category"
                marginY={5}
                isSingle={true}
            >
                <Form
                    onSubmit={(data: Category) => onUpdate(data)}
                    initialValues={category}
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
                                            helperText={
                                                meta.touched && meta.error
                                            }
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2, display: 'flex' }}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    loading={updateMutation.isLoading}
                                >
                                    Save
                                </LoadingButton>
                                <Button
                                    onClick={() => handleDelete(categoryId)}
                                    variant="outlined"
                                    color="error"
                                    sx={{ ml: 2 }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </form>
                    )}
                />
                <Box>
                    <Link href={`/recipes?categoryId=${categoryId}`} passHref>
                        <Button variant="text" color="secondary">
                            View recipes
                        </Button>
                    </Link>
                </Box>
            </ContentWithStatus>
        </Fragment>
    );
};

export default ViewCategory;
