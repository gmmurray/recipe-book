import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Rating,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import { Fragment, useCallback } from 'react';
import { isMaxLength, isRequired } from '../../../util/validation';
import {
    showErrorSnackbar,
    showSuccessSnackbar,
} from '../../../config/notistack';

import ArrowBack from '@mui/icons-material/ArrowBack';
import { CredentialUser } from '../../../entities/CredentialUser';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { Recipe } from '../../../entities/Recipe';
import { useCreateRecipeMutation } from '../../../lib/queries/recipeQueries';
import { useGetCategories } from '../../../lib/queries/categoryQueries';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

const NewRecipe = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { data: session } = useSession();

    const createMutation = useCreateRecipeMutation();
    const { data: categories, isLoading: categoriesIsLoading } =
        useGetCategories(null);

    const handleCreate = useCallback(
        async (data: Partial<Recipe>) => {
            createMutation.mutate(
                {
                    ...data,
                    userId: (session?.user as CredentialUser)._id,
                    categoryId:
                        data.categoryId === '0' ? null : data.categoryId,
                    rating: parseInt(data.rating?.toString() ?? '0'),
                },
                {
                    onSuccess: async result => {
                        showSuccessSnackbar(enqueueSnackbar, 'Recipe created');
                        router.push(`/recipes/${result._id}`);
                    },
                    onError: async () =>
                        showErrorSnackbar(
                            enqueueSnackbar,
                            'Error creating recipe',
                        ),
                },
            );
        },
        [createMutation, enqueueSnackbar, router, session?.user],
    );

    return (
        <Fragment>
            <Box display="flex" alignItems="center">
                <Typography variant="h3">Add recipe</Typography>
                <Link href="/recipes" passHref>
                    <Button
                        sx={{ ml: 'auto' }}
                        variant="outlined"
                        startIcon={<ArrowBack />}
                    >
                        Back to list
                    </Button>
                </Link>
            </Box>
            <Form
                onSubmit={(data: Partial<Recipe>) => handleCreate(data)}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            sx={{ my: 2, maxWidth: { md: '50%' } }}
                            columns={6}
                            spacing={2}
                        >
                            <Grid item xs={12} md={3}>
                                <Field
                                    name="name"
                                    validate={isRequired('Name')}
                                    render={({ input, meta }) => (
                                        <TextField
                                            {...input}
                                            label="Name"
                                            variant="outlined"
                                            fullWidth
                                            error={meta.error && meta.touched}
                                            helperText={
                                                meta.touched && meta.error
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Field
                                    name="categoryId"
                                    initialValue={null}
                                    render={({ input }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                {...input}
                                                label="Category"
                                                disabled={
                                                    categoriesIsLoading ||
                                                    !categories ||
                                                    categories.length === 0
                                                }
                                                startAdornment={
                                                    categoriesIsLoading ? (
                                                        <CircularProgress />
                                                    ) : undefined
                                                }
                                            >
                                                <MenuItem value="0">
                                                    No Category
                                                </MenuItem>
                                                {(categories ?? []).map(c => (
                                                    <MenuItem
                                                        key={c._id}
                                                        value={c._id}
                                                    >
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    type="radio"
                                    name="rating"
                                    initialValue={0}
                                    render={({ input }) => (
                                        <Fragment>
                                            <Typography component="legend">
                                                Rating
                                            </Typography>
                                            <Rating {...input} />
                                        </Fragment>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Field
                                    name="notes"
                                    validate={isMaxLength('Notes', 450)}
                                    render={({ input, meta }) => (
                                        <TextField
                                            {...input}
                                            label="Notes"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            error={meta.error && meta.touched}
                                            helperText={
                                                meta.touched && meta.error
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    loading={createMutation.isLoading}
                                >
                                    Save
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </Fragment>
    );
};
// notes rating
export default NewRecipe;
