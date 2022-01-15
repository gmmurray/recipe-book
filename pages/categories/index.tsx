import { Add, Delete } from '@mui/icons-material';
import {
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { Fragment, useCallback } from 'react';
import { showErrorSnackbar, showSuccessSnackbar } from '../../config/notistack';
import {
    useDeleteCategory,
    useGetCategories,
} from '../../lib/queries/categoryQueries';

import { Box } from '@mui/system';
import ContentWithStatus from '../../components/shared/ContentWithStatus';
import Link from 'next/link';
import { pluralCountText } from '../../util/plural';
import { useSnackbar } from 'notistack';

const Categories = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { data: categories, isLoading } = useGetCategories(null);

    const deleteMutation = useDeleteCategory();

    const handleDelete = useCallback(
        async (id: string) =>
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
            <Typography variant="caption" color="text.dark">
                {!isLoading &&
                    pluralCountText('category', 'categories', categories)}
            </Typography>
            <ContentWithStatus
                loading={isLoading}
                empty={!categories || categories.length === 0}
                name="categories"
                marginY={5}
            >
                <List>
                    {(categories ?? []).map(({ _id, name }, index) => {
                        const showDivider =
                            index !== (categories ?? []).length - 1;
                        return (
                            <Fragment key={_id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(_id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                    disablePadding
                                >
                                    <Link href={`/categories/${_id}`} passHref>
                                        <ListItemButton>
                                            <ListItemText primary={name} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                {showDivider && <Divider />}
                            </Fragment>
                        );
                    })}
                </List>
            </ContentWithStatus>
        </Fragment>
    );
};

export default Categories;
