import {
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Rating,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Field, Form } from 'react-final-form';
import { Fragment, useCallback, useState } from 'react';
import {
    composeValidators,
    isMaxLength,
    isRequired,
    isValidUrl,
} from '../../util/validation';
import { showErrorSnackbar, showSuccessSnackbar } from '../../config/notistack';
import {
    useDeleteRecipeMutation,
    useGetRecipeQuery,
    useUpdateRecipeMutation,
} from '../../lib/queries/recipeQueries';

import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';
import ContentWithStatus from '../../components/shared/ContentWithStatus';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { Recipe } from '../../entities/Recipe';
import { addHttp } from '../../util/addHttp';
import { resolveQueryParam } from '../../util/resolveQueryParam';
import { useGetCategories } from '../../lib/queries/categoryQueries';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const ViewRecipe = () => {
    const [showRecipe, setShowRecipe] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const recipeId = resolveQueryParam(router.query, 'recipeId');

    const { data: recipe, isLoading: recipeIsLoading } =
        useGetRecipeQuery(recipeId);

    const updateMutation = useUpdateRecipeMutation();
    const { data: categories, isLoading: categoriesIsLoading } =
        useGetCategories(null, null);

    const handleUpdate = useCallback(
        async (data: Recipe) => {
            updateMutation.mutate(
                {
                    ...data,
                    categoryId:
                        data.categoryId === '0' ? null : data.categoryId,
                    rating: parseInt(data.rating?.toString() ?? '0'),
                    url: addHttp(data.url),
                },
                {
                    onSuccess: async () =>
                        showSuccessSnackbar(enqueueSnackbar, 'Recipe updated'),
                    onError: async () =>
                        showErrorSnackbar(
                            enqueueSnackbar,
                            'Error updating recipe',
                        ),
                },
            );
        },
        [enqueueSnackbar, updateMutation],
    );

    const deleteMutation = useDeleteRecipeMutation();

    const handleDelete = useCallback(
        async (id: string | null) => {
            if (!id) {
                return;
            }
            deleteMutation.mutate(id, {
                onSuccess: async () =>
                    showSuccessSnackbar(enqueueSnackbar, 'Recipe deleted'),
                onError: async () =>
                    showErrorSnackbar(enqueueSnackbar, 'Error deleting recipe'),
            });
            router.push('/recipes');
        },
        [deleteMutation, enqueueSnackbar, router],
    );

    if (recipeIsLoading) return null;
    return (
        <Fragment>
            <Box display="flex" alignItems="center">
                <Typography variant="h3">View recipe</Typography>
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
            <Paper sx={{ px: 2 }}>
                <ContentWithStatus
                    loading={recipeIsLoading}
                    empty={!recipe}
                    name="recipe"
                    marginY={5}
                    isSingle={true}
                >
                    <Form
                        onSubmit={(data: Recipe) => handleUpdate(data)}
                        initialValues={{
                            ...recipe,
                            rating: parseInt((recipe?.rating ?? 0).toString()),
                        }}
                        render={({ handleSubmit, values }) => (
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
                                                    error={
                                                        meta.error &&
                                                        meta.touched
                                                    }
                                                    helperText={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Field
                                            name="categoryId"
                                            render={({ input }) => (
                                                <FormControl fullWidth>
                                                    <InputLabel>
                                                        Category
                                                    </InputLabel>
                                                    <Select
                                                        {...input}
                                                        label="Category"
                                                        disabled={
                                                            categoriesIsLoading ||
                                                            !categories ||
                                                            categories.length ===
                                                                0
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
                                                        {(categories ?? []).map(
                                                            c => (
                                                                <MenuItem
                                                                    key={c._id!}
                                                                    value={
                                                                        c._id!
                                                                    }
                                                                >
                                                                    {c.name}
                                                                </MenuItem>
                                                            ),
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            name="url"
                                            validate={composeValidators(
                                                isRequired('Url'),
                                                isValidUrl('Url'),
                                            )}
                                            render={({ input, meta }) => (
                                                <TextField
                                                    {...input}
                                                    label="Url"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={
                                                        meta.error &&
                                                        meta.touched
                                                    }
                                                    helperText={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                />
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
                                                    error={
                                                        meta.error &&
                                                        meta.touched
                                                    }
                                                    helperText={
                                                        meta.touched &&
                                                        meta.error
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            type="radio"
                                            name="rating"
                                            key={`${values.rating}-rating`}
                                            render={({ input }) => (
                                                <Fragment>
                                                    <Typography component="legend">
                                                        Rating
                                                    </Typography>
                                                    <Rating
                                                        {...input}
                                                        defaultValue={
                                                            values.rating
                                                        }
                                                        key={`${values.rating}-rating`}
                                                    />
                                                </Fragment>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 2 }}>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            loading={updateMutation.isLoading}
                                        >
                                            Save
                                        </LoadingButton>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                                handleDelete(recipeId)
                                            }
                                            sx={{ ml: 2 }}
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    />
                </ContentWithStatus>
            </Paper>
            <Box display="flex">
                <Button
                    variant="outlined"
                    onClick={() => setShowRecipe(state => !state)}
                >
                    {showRecipe ? 'Hide recipe' : 'Show recipe'}
                </Button>
                <Button
                    href={recipe?.url ?? ''}
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 2 }}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Go to recipe
                </Button>
            </Box>
            {showRecipe && (
                <Box sx={{ minWidth: '100%', my: 2 }}>
                    <iframe
                        src={recipe?.url}
                        style={{
                            width: '100%',
                            height: '100vh',
                            borderRadius: '4px',
                            border: 'none',
                        }}
                    />
                </Box>
            )}
        </Fragment>
    );
};

export default ViewRecipe;
