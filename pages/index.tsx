import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Fade,
    Grid,
    Link as MUILink,
    Typography,
} from '@mui/material';
import { pluralCountText, pluralize } from '../util/plural';

import { Box } from '@mui/system';
import Link from 'next/link';
import type { NextPage } from 'next';
import { Recipe } from '../entities/Recipe';
import { StarRate } from '@mui/icons-material';
import { addHttp } from '../util/addHttp';
import { useGetCategories } from '../lib/queries/categoryQueries';
import { useGetHomepageRecipes } from '../lib/queries/recipeQueries';
import { useSession } from 'next-auth/react';

const mockRecommendedWebsites = [
    'http://google.com',
    'http://facebook.com',
    'http://instagram.com',
    'http://amazon.com',
    'http://recipes.com',
];

const mockRecipe: Recipe = {
    _id: '1',
    name: 'Recipe one',
    url: 'gregmurray.org',
    userId: '123',
    notes: '',
    rating: 5,
    createdAt: new Date(),
};
const mockRecentlyCreatedRecipes: Recipe[] = [
    {
        ...mockRecipe,
        _id: '1',
        name: 'recipe one',
    },
    {
        ...mockRecipe,
        _id: '2',
        name: 'recipe two',
    },
    {
        ...mockRecipe,
        _id: '3',
        name: 'recipe three',
    },
    {
        ...mockRecipe,
        _id: '4',
        name: 'recipe four',
    },
    {
        ...mockRecipe,
        _id: '5',
        name: 'recipe five',
    },
];
const mockHighestRatedRecipes: Recipe[] = [
    {
        ...mockRecipe,
        _id: '1',
        name: 'recipe one',
        rating: 5,
    },
    {
        ...mockRecipe,
        _id: '2',
        name: 'recipe two',
        rating: 4,
    },
    {
        ...mockRecipe,
        _id: '3',
        name: 'recipe three',
        rating: 3,
    },
    {
        ...mockRecipe,
        _id: '4',
        name: 'recipe four',
        rating: 2,
    },
    {
        ...mockRecipe,
        _id: '5',
        name: 'recipe five',
        rating: 1,
    },
];

const Home: NextPage = () => {
    const { data: categories, isLoading: categoriesAreLoading } =
        useGetCategories(null, null);
    const { data: recipes, isLoading: recipesLoading } =
        useGetHomepageRecipes();

    const isCenteredWebsites =
        recipesLoading || (recipes?.recommendedWebsites ?? []).length === 0;
    const isCenteredRecent =
        recipesLoading || (recipes?.recentlyAdded ?? []).length === 0;
    const isCenteredRated =
        recipesLoading || (recipes?.highestRated ?? []).length === 0;

    return (
        <Container maxWidth="xl">
            <Typography variant="h1" gutterBottom>
                Welcome
            </Typography>
            <Grid container spacing={2} textAlign="center">
                <Grid item xs={12} md={6}>
                    <Fade in={true} timeout={500}>
                        <Card>
                            <Link href="/recipes" passHref>
                                <CardActionArea>
                                    <CardContent
                                        sx={{ minHeight: '250px' }}
                                        component={Grid}
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item xs={3}>
                                            {recipesLoading && (
                                                <CircularProgress />
                                            )}
                                            {!recipesLoading && (
                                                <Typography
                                                    variant="h3"
                                                    sx={{ mt: 'auto' }}
                                                >
                                                    {pluralCountText(
                                                        'recipe',
                                                        'recipes',
                                                        [
                                                            ...Array(
                                                                recipes?.lookup
                                                                    .size,
                                                            ),
                                                        ],
                                                    )}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                            <CardActions
                                sx={{ justifyContent: 'center', my: 2 }}
                            >
                                <Link href="/recipes/new" passHref>
                                    <Button size="large" variant="contained">
                                        New recipe
                                    </Button>
                                </Link>
                            </CardActions>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Fade in={true} timeout={500}>
                        <Card>
                            <Link href="/categories" passHref>
                                <CardActionArea>
                                    <CardContent
                                        sx={{ minHeight: '250px' }}
                                        component={Grid}
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item xs={3}>
                                            {categoriesAreLoading && (
                                                <CircularProgress />
                                            )}
                                            {!categoriesAreLoading && (
                                                <Typography variant="h3">
                                                    {pluralCountText(
                                                        'category',
                                                        'categories',
                                                        categories,
                                                    )}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                            <CardActions
                                sx={{ justifyContent: 'center', my: 2 }}
                            >
                                <Link href="/categories/new" passHref>
                                    <Button size="large" variant="contained">
                                        New category
                                    </Button>
                                </Link>
                            </CardActions>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12}>
                    <Fade in={true} timeout={500}>
                        <Card sx={{ p: 1, textAlign: 'left' }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Recommended websites based on your recipes
                                </Typography>
                                <Box
                                    ml={isCenteredWebsites ? 0 : 2}
                                    textAlign={
                                        isCenteredWebsites
                                            ? 'center'
                                            : undefined
                                    }
                                >
                                    {recipesLoading && <CircularProgress />}
                                    {(recipes?.recommendedWebsites ?? [])
                                        .length === 0 && (
                                        <Typography variant="overline">
                                            No data available
                                        </Typography>
                                    )}
                                    {recipes?.recommendedWebsites &&
                                        recipes.recommendedWebsites.map(
                                            (url, index) => (
                                                <Box key={index}>
                                                    <MUILink
                                                        href={addHttp(url)}
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                    >
                                                        {url}
                                                    </MUILink>
                                                </Box>
                                            ),
                                        )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12}>
                    <Fade in={true} timeout={500}>
                        <Card sx={{ p: 1, textAlign: 'left' }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Recently added recipes
                                </Typography>
                                <Box
                                    ml={isCenteredRecent ? 0 : 2}
                                    textAlign={
                                        isCenteredRated ? 'center' : undefined
                                    }
                                >
                                    {recipesLoading && <CircularProgress />}
                                    {(recipes?.recentlyAdded ?? []).length ===
                                        0 && (
                                        <Typography variant="overline">
                                            No data available
                                        </Typography>
                                    )}
                                    {recipes?.recentlyAdded &&
                                        recipes.recentlyAdded.map(id => {
                                            const recipe =
                                                recipes.lookup.get(id);

                                            if (!recipe) {
                                                return null;
                                            }

                                            return (
                                                <Box
                                                    key={recipe._id}
                                                    textAlign="left"
                                                    display="flex"
                                                >
                                                    <Link
                                                        href={`/recipes/${recipe._id}`}
                                                        passHref
                                                    >
                                                        <MUILink
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                        >
                                                            {recipe.name}
                                                        </MUILink>
                                                    </Link>
                                                    <Typography
                                                        sx={{ ml: 'auto' }}
                                                    >
                                                        {new Date(
                                                            recipe.createdAt,
                                                        ).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12}>
                    <Fade in={true} timeout={500}>
                        <Card sx={{ p: 1, textAlign: 'left' }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Highest rated recipes
                                </Typography>
                                <Box
                                    ml={isCenteredRated ? 0 : 2}
                                    textAlign={
                                        isCenteredRated ? 'center' : undefined
                                    }
                                >
                                    {recipesLoading && <CircularProgress />}
                                    {(recipes?.highestRated ?? []).length ===
                                        0 && (
                                        <Typography variant="overline">
                                            No data available
                                        </Typography>
                                    )}
                                    {recipes?.highestRated &&
                                        recipes.highestRated.map(id => {
                                            const recipe =
                                                recipes.lookup.get(id);

                                            if (!recipe) {
                                                return null;
                                            }

                                            return (
                                                <Box
                                                    key={recipe._id}
                                                    textAlign="left"
                                                    display="flex"
                                                >
                                                    <Link
                                                        href={`/recipes/${recipe._id}`}
                                                        passHref
                                                    >
                                                        <MUILink
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                        >
                                                            {recipe.name}
                                                        </MUILink>
                                                    </Link>
                                                    <Typography
                                                        sx={{ ml: 'auto' }}
                                                    >
                                                        {recipe.rating}{' '}
                                                        <StarRate
                                                            sx={{
                                                                fontSize:
                                                                    '13px',
                                                            }}
                                                        />
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
