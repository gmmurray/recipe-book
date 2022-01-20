import {
    Add,
    Clear,
    ExpandLess,
    ExpandMore,
    Sort,
    StarRate,
} from '@mui/icons-material';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Fade,
    Grid,
    IconButton,
    InputAdornment,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Rating,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    ChangeEvent,
    Fragment,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    RecipeFilter,
    RecipeSort,
    defaultRecipeFilter,
    defaultRecipeSort,
} from '../../entities/Recipe';
import { showErrorSnackbar, showSuccessSnackbar } from '../../config/notistack';
import {
    useDeleteRecipeMutation,
    useGetRecipesQuery,
} from '../../lib/queries/recipeQueries';

import { Box } from '@mui/system';
import { Category } from '../../entities/Category';
import ContentWithStatus from '../../components/shared/ContentWithStatus';
import Link from 'next/link';
import { pluralCountText } from '../../util/plural';
import { resolveQueryParam } from '../../util/resolveQueryParam';
import { useDebouncedSearch } from '../../util/useDebouncedSearch';
import { useGetCategories } from '../../lib/queries/categoryQueries';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

type FilterChip = {
    key: string | number;
    content: ReactNode;
    onDelete: () => any;
    type: string;
};

type MenuAnchorKey = 'parent' | 'category' | 'rating' | 'sort';

const ViewRecipes = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const categoryId = resolveQueryParam(router.query, 'categoryId');

    const [categoryFilter, setCategoryFilter] = useState<
        RecipeFilter['categoryId']
    >(defaultRecipeFilter.categoryId);
    const [ratingFilter, setRatingFilter] = useState<RecipeFilter['rating']>(
        defaultRecipeFilter.rating,
    );

    const [searchValue, setSearchValue] = useState('');
    const [nameNotesFilter, setNameNotesFilter] = useState<
        RecipeFilter['name']
    >(defaultRecipeFilter.name);

    const [recipeSort, setRecipeSort] = useState<RecipeSort>(defaultRecipeSort);

    const { data: recipes, isLoading: recipesLoading } = useGetRecipesQuery(
        {
            categoryId: categoryFilter,
            rating: ratingFilter,
            name: nameNotesFilter,
            notes: nameNotesFilter,
        },
        recipeSort,
    );

    const { data: categories, isLoading: categoriesLoading } = useGetCategories(
        null,
        null,
    );

    const [menuAnchors, setMenuAnchors] = useState<
        Record<MenuAnchorKey, HTMLElement | null>
    >({
        parent: null,
        category: null,
        rating: null,
        sort: null,
    });

    const [filteredCategories, setFilteredCategories] = useState<Category[]>(
        [],
    );

    const [availableCategories, setAvailableCategories] = useState<Category[]>(
        [],
    );

    const [filterChips, setFilterChips] = useState<FilterChip[]>([]);

    useEffect(() => {
        const ids = filteredCategories.map(c => c!._id);
        setCategoryFilter(ids.length > 0 ? ids : undefined);
    }, [filteredCategories]);

    const handleMenuOpen = useCallback(
        (
            event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>,
            key: MenuAnchorKey,
        ) =>
            setMenuAnchors(state => ({
                ...state,
                [key]: event.currentTarget,
            })),
        [],
    );

    const handleMenuClose = useCallback(
        (key: MenuAnchorKey) =>
            setMenuAnchors(state => ({ ...state, [key]: null })),
        [],
    );

    const deleteMutation = useDeleteRecipeMutation();

    const handleDelete = useCallback(
        async (id: string) =>
            deleteMutation.mutate(id, {
                onSuccess: async () =>
                    showSuccessSnackbar(enqueueSnackbar, 'Recipe deleted'),
                onError: async () =>
                    showErrorSnackbar(enqueueSnackbar, 'Error deleting recipe'),
            }),
        [deleteMutation, enqueueSnackbar],
    );

    const handleRecipeNavigation = useCallback(
        (id: string) => router.push(`/recipes/${id}`),
        [router],
    );

    const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = e;
        if (value === '') {
            setNameNotesFilter(undefined);
        } else {
            setNameNotesFilter(value);
        }
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
        setNameNotesFilter(undefined);
    }, []);

    const debouncedSearch = useDebouncedSearch(handleSearch, 500);

    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
            debouncedSearch(e);
        },
        [debouncedSearch],
    );

    useEffect(() => {
        if (categoryId) {
            setCategoryFilter(categoryId);
            if (categories && categories.some(c => c._id === categoryId)) {
                setFilteredCategories(state => [
                    ...state,
                    categories.find(c => c._id === categoryId)!,
                ]);
            }
        }
    }, [categories, categoryId]);

    const handleCategoryToggle = useCallback(
        (category: Category) => {
            let newValue = [...filteredCategories];
            if (
                newValue.length > 0 &&
                newValue.find(c => c._id === category._id)
            ) {
                newValue = newValue.filter(c => c._id !== category._id);
                if (category._id === categoryId) {
                    router.replace('/recipes');
                }
            } else {
                newValue = [...newValue, category];
            }
            setFilteredCategories(newValue);
        },
        [categoryId, filteredCategories, router],
    );

    useEffect(() => {
        setAvailableCategories([
            { _id: null, name: 'No category', userId: '' },
            ...(categories ?? []),
        ]);
    }, [categories]);

    const handleRatingFilterChange = useCallback(
        (rating: number) => {
            if (ratingFilter === rating) {
                setRatingFilter(undefined);
            } else {
                setRatingFilter(rating);
            }
        },
        [ratingFilter],
    );

    useEffect(() => {
        const newCategoryChips = filteredCategories.map(c => ({
            key: c._id!,
            content: c.name,
            onDelete: () => handleCategoryToggle(c),
            type: 'category',
        }));
        setFilterChips(state => [
            ...state.filter(fc => fc.type !== 'category'),
            ...newCategoryChips,
        ]);
    }, [filteredCategories, handleCategoryToggle]);

    useEffect(() => {
        if (ratingFilter !== undefined) {
            const newRatingChip: FilterChip = {
                key: ratingFilter,
                content:
                    ratingFilter === 0 ? (
                        'No rating'
                    ) : (
                        <Fragment>
                            {ratingFilter}{' '}
                            <StarRate sx={{ fontSize: '13px' }} />
                        </Fragment>
                    ),
                onDelete: () => handleRatingFilterChange(ratingFilter),
                type: 'rating',
            };
            setFilterChips(state => [...state, newRatingChip]);
        } else {
            setFilterChips(state => [
                ...state.filter(fc => fc.type !== 'rating'),
            ]);
        }
    }, [handleRatingFilterChange, ratingFilter]);

    const handleSortChange = useCallback(
        (field: RecipeSort['sortField']) => {
            if (recipeSort.sortField === field) {
                setRecipeSort(state => ({
                    ...state,
                    sortDir: state.sortDir === 'asc' ? 'desc' : 'asc',
                }));
            } else {
                setRecipeSort({ sortField: field, sortDir: 'asc' });
            }
        },
        [recipeSort.sortField],
    );

    return (
        <Fragment>
            <Box display="flex" alignItems="center">
                <Typography variant="h3">Recipes</Typography>
                <Link
                    href={`/recipes/new${
                        categoryId ? `?categoryId=${categoryId}` : ''
                    }`}
                    passHref
                >
                    <Button
                        sx={{ ml: 'auto' }}
                        variant="outlined"
                        startIcon={<Add />}
                    >
                        New
                    </Button>
                </Link>
            </Box>
            <Box mb={1}>
                <Typography variant="caption" color="text.secondary">
                    {recipesLoading ? (
                        <span>&nbsp;&nbsp;</span>
                    ) : (
                        pluralCountText('recipe', 'recipes', recipes)
                    )}
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        variant="standard"
                        label="Search"
                        fullWidth
                        onChange={handleSearchChange}
                        value={searchValue}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch}>
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ height: '100%' }}
                        size="small"
                        startIcon={<Sort />}
                        onClick={event => handleMenuOpen(event, 'sort')}
                    >
                        Sort
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ height: '100%' }}
                        size="small"
                        startIcon={<Add />}
                        onClick={event => handleMenuOpen(event, 'parent')}
                    >
                        Filter
                    </Button>
                </Grid>
            </Grid>
            {filterChips.length > 0 && (
                <Stack direction="row" spacing={1} pb={2}>
                    {filterChips.map(({ key, content, onDelete }) => (
                        <Chip key={key} label={content} onDelete={onDelete} />
                    ))}
                </Stack>
            )}
            <ContentWithStatus
                loading={recipesLoading}
                empty={!recipes || recipes.length === 0}
                name="recipes"
                marginY={5}
            >
                <Fragment>
                    <Grid container spacing={2}>
                        {(recipes ?? []).map(
                            ({ _id, name, category, url, rating }) => (
                                <Grid key={_id} item xs={12} md={4}>
                                    <Fade in={true} timeout={500}>
                                        <Card sx={{ minHeight: '100%' }}>
                                            <CardActionArea
                                                onClick={() =>
                                                    handleRecipeNavigation(_id)
                                                }
                                            >
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        {name}
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        gutterBottom
                                                    >
                                                        {category?.name ??
                                                            'No category'}
                                                    </Typography>
                                                    {rating === 0 ? (
                                                        <Typography
                                                            color="warning.main"
                                                            variant="subtitle2"
                                                        >
                                                            No rating
                                                        </Typography>
                                                    ) : (
                                                        <Rating
                                                            value={rating}
                                                            size="small"
                                                            readOnly
                                                        />
                                                    )}
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    href={url}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                >
                                                    Open
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(_id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Fade>
                                </Grid>
                            ),
                        )}
                    </Grid>
                </Fragment>
            </ContentWithStatus>
            <Menu
                anchorEl={menuAnchors.parent}
                open={!!menuAnchors.parent}
                onClose={() => handleMenuClose('parent')}
            >
                <MenuItem
                    onClick={event => handleMenuOpen(event, 'category')}
                    selected={!!categoryFilter}
                >
                    Category
                </MenuItem>
                <MenuItem
                    onClick={event => handleMenuOpen(event, 'rating')}
                    selected={!!ratingFilter}
                >
                    Rating
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={menuAnchors.category}
                open={!!menuAnchors.category}
                onClose={() => handleMenuClose('category')}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={categoriesLoading ? 'loading-menu' : undefined}
            >
                {categoriesLoading ? (
                    <CircularProgress size={30} />
                ) : (
                    availableCategories.map(c => (
                        <MenuItem
                            key={c._id}
                            onClick={() => handleCategoryToggle(c)}
                            selected={filteredCategories.some(
                                cat => cat._id === c._id,
                            )}
                        >
                            {c.name}
                        </MenuItem>
                    ))
                )}
            </Menu>
            <Menu
                anchorEl={menuAnchors.rating}
                open={!!menuAnchors.rating}
                onClose={() => handleMenuClose('rating')}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {[5, 4, 3, 2, 1, 0].map(value => (
                    <MenuItem
                        key={value}
                        onClick={() => handleRatingFilterChange(value)}
                        selected={ratingFilter === value}
                        disabled={
                            ratingFilter !== undefined && ratingFilter !== value
                        }
                    >
                        {[...Array(value)].map((s, i) => (
                            <StarRate key={i} sx={{ fontSize: '1rem' }} />
                        ))}
                        {value === 0 ? 'No rating' : null}
                    </MenuItem>
                ))}
            </Menu>
            <Menu
                anchorEl={menuAnchors.sort}
                open={!!menuAnchors.sort}
                onClose={() => handleMenuClose('sort')}
            >
                <MenuItem onClick={() => handleSortChange('name')}>
                    <ListItemText>Name</ListItemText>
                    <ListItemIcon>
                        {recipeSort.sortField === 'name' &&
                            recipeSort.sortDir === 'asc' && (
                                <ExpandMore sx={{ ml: 'auto' }} />
                            )}
                        {recipeSort.sortField === 'name' &&
                            recipeSort.sortDir === 'desc' && (
                                <ExpandLess sx={{ ml: 'auto' }} />
                            )}
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('category')}>
                    <ListItemText>Category</ListItemText>
                    <ListItemIcon>
                        {recipeSort.sortField === 'category' &&
                            recipeSort.sortDir === 'asc' && (
                                <ExpandMore sx={{ ml: 'auto' }} />
                            )}
                        {recipeSort.sortField === 'category' &&
                            recipeSort.sortDir === 'desc' && (
                                <ExpandLess sx={{ ml: 'auto' }} />
                            )}
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('rating')}>
                    <ListItemText>Rating</ListItemText>
                    <ListItemIcon>
                        {recipeSort.sortField === 'rating' &&
                            recipeSort.sortDir === 'asc' && (
                                <ExpandMore sx={{ ml: 'auto' }} />
                            )}
                        {recipeSort.sortField === 'rating' &&
                            recipeSort.sortDir === 'desc' && (
                                <ExpandLess sx={{ ml: 'auto' }} />
                            )}
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default ViewRecipes;
