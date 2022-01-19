import {
    Add,
    Clear,
    Delete,
    ExpandLess,
    ExpandMore,
    Sort,
} from '@mui/icons-material';
import {
    Button,
    Divider,
    Fade,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {
    CategoryFilter,
    CategorySort,
    defaultCategoryFilter,
    defaultCategorySort,
} from '../../entities/Category';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { showErrorSnackbar, showSuccessSnackbar } from '../../config/notistack';
import {
    useDeleteCategory,
    useGetCategories,
} from '../../lib/queries/categoryQueries';

import { Box } from '@mui/system';
import ContentWithStatus from '../../components/shared/ContentWithStatus';
import Link from 'next/link';
import { pluralCountText } from '../../util/plural';
import { useDebouncedSearch } from '../../util/useDebouncedSearch';
import { useSnackbar } from 'notistack';

const Categories = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [nameFilter, setNameFilter] = useState<CategoryFilter['name']>(
        defaultCategoryFilter.name,
    );
    const [searchValue, setSearchValue] = useState('');
    const [sort, setSort] = useState<CategorySort>(defaultCategorySort);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const { data: categories, isLoading } = useGetCategories(
        { name: nameFilter },
        sort,
    );

    const deleteMutation = useDeleteCategory();

    const handleDelete = useCallback(
        async (id: string | null) =>
            deleteMutation.mutate(id, {
                onSuccess: async () =>
                    showSuccessSnackbar(enqueueSnackbar, 'Category deleted'),
                onError: async () =>
                    showErrorSnackbar(
                        enqueueSnackbar,
                        'Error deleting category',
                    ),
            }),
        [deleteMutation, enqueueSnackbar],
    );

    const handleMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) =>
            setMenuAnchor(event.currentTarget),
        [],
    );

    const handleMenuClose = useCallback(() => setMenuAnchor(null), []);

    const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = e;
        if (value === '') {
            setNameFilter(undefined);
        } else {
            setNameFilter(value);
        }
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchValue('');
        setNameFilter(undefined);
    }, []);

    const debouncedSearch = useDebouncedSearch(handleSearch, 500);

    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
            debouncedSearch(e);
        },
        [debouncedSearch],
    );

    const handleSortChange = useCallback(
        (field: CategorySort['sortField']) => {
            if (sort.sortField === field) {
                setSort(state => ({
                    ...state,
                    sortDir: state.sortDir === 'asc' ? 'desc' : 'asc',
                }));
            } else {
                setSort({ sortField: field, sortDir: 'asc' });
            }
        },
        [sort.sortField],
    );

    return (
        <Fragment>
            <Box display="flex" alignItems="center">
                <Typography variant="h3">Categories</Typography>
                <Link href="/categories/new" passHref>
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
                    {isLoading ? (
                        <span>&nbsp;&nbsp;</span>
                    ) : (
                        pluralCountText('category', 'categories', categories)
                    )}
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={9}>
                    <TextField
                        variant="standard"
                        label="Search"
                        fullWidth
                        onChange={handleSearchChange}
                        value={searchValue}
                        InputProps={
                            searchValue === ''
                                ? undefined
                                : {
                                      endAdornment: (
                                          <InputAdornment position="end">
                                              <IconButton
                                                  onClick={handleClearSearch}
                                              >
                                                  <Clear />
                                              </IconButton>
                                          </InputAdornment>
                                      ),
                                  }
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ height: '100%' }}
                        size="small"
                        startIcon={<Sort />}
                        onClick={event => handleMenuOpen(event)}
                    >
                        Sort
                    </Button>
                </Grid>
            </Grid>
            <ContentWithStatus
                loading={isLoading}
                empty={!categories || categories.length === 0}
                name="categories"
                marginY={5}
            >
                <List>
                    {(categories ?? []).map(({ _id, name, recipes }, index) => {
                        const showDivider =
                            index !== (categories ?? []).length - 1;
                        return (
                            <Fragment key={_id}>
                                <Fade in={true} timeout={500}>
                                    <Box>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    onClick={() =>
                                                        handleDelete(_id)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            }
                                            disablePadding
                                        >
                                            <Link
                                                href={`/categories/${_id}`}
                                                passHref
                                            >
                                                <ListItemButton>
                                                    <ListItemText
                                                        primary={name}
                                                        secondary={`${recipes.length} recipe(s)`}
                                                    />
                                                </ListItemButton>
                                            </Link>
                                        </ListItem>
                                        {showDivider && <Divider />}
                                    </Box>
                                </Fade>
                            </Fragment>
                        );
                    })}
                </List>
            </ContentWithStatus>
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={() => handleMenuClose()}
            >
                <MenuItem onClick={() => handleSortChange('name')}>
                    <ListItemText>Name</ListItemText>
                    <ListItemIcon>
                        {sort.sortField === 'name' &&
                            sort.sortDir === 'asc' && (
                                <ExpandMore sx={{ ml: 'auto' }} />
                            )}
                        {sort.sortField === 'name' &&
                            sort.sortDir === 'desc' && (
                                <ExpandLess sx={{ ml: 'auto' }} />
                            )}
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('recipes')}>
                    <ListItemText>Recipes</ListItemText>
                    <ListItemIcon>
                        {sort.sortField === 'recipes' &&
                            sort.sortDir === 'asc' && (
                                <ExpandMore sx={{ ml: 'auto' }} />
                            )}
                        {sort.sortField === 'recipes' &&
                            sort.sortDir === 'desc' && (
                                <ExpandLess sx={{ ml: 'auto' }} />
                            )}
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default Categories;
