const makePageTitle = (value: string) => `${value} - Recipe Book`;

type RouteBreadcrumb = { title: string; pathname: string };

export type RouteMapRoute = {
    title: string;
    pageTitle: string;
    breadcrumbs?: RouteBreadcrumb[];
    isDefault?: boolean;
};

export type RouteMap = Record<string, RouteMapRoute>;

export const routeMap: RouteMap = {
    ['/']: {
        title: 'Home',
        pageTitle: makePageTitle('Home'),
    },
    ['/categories']: {
        title: 'Categories',
        pageTitle: makePageTitle('Categories'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
        ],
    },
    ['/categories/[categoryId]']: {
        title: 'View',
        pageTitle: makePageTitle('View Category'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
            {
                title: 'Categories',
                pathname: '/categories',
            },
        ],
    },
    ['/categories/new']: {
        title: 'New',
        pageTitle: makePageTitle('New Category'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
            {
                title: 'Categories',
                pathname: '/categories',
            },
        ],
    },
    ['/recipes']: {
        title: 'Recipes',
        pageTitle: makePageTitle('Recipes'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
        ],
    },
    ['/recipes/[recipeId]']: {
        title: 'View',
        pageTitle: makePageTitle('View Recipe'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
            {
                title: 'Recipes',
                pathname: '/recipes',
            },
        ],
    },
    ['/recipes/new']: {
        title: 'New',
        pageTitle: makePageTitle('New Recipe'),
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
            {
                title: 'Recipes',
                pathname: '/recipes',
            },
        ],
    },
    default: {
        title: 'Home',
        pageTitle: makePageTitle('Home'),
        isDefault: true,
    },
};

export type NavbarRoute = { title: string; pathname: string };
export const navbarRoutes: NavbarRoute[] = [
    {
        title: 'Recipes',
        pathname: '/recipes',
    },
    {
        title: 'Categories',
        pathname: '/categories',
    },
];
