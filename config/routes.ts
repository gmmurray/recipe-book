type RouteBreadcrumb = { title: string; pathname: string };

export type RouteMapRoute = {
    title: string;
    breadcrumbs?: RouteBreadcrumb[];
    isDefault?: boolean;
};

export type RouteMap = Record<string, RouteMapRoute>;

export const routeMap: RouteMap = {
    ['/']: {
        title: 'Home',
    },
    ['/categories']: {
        title: 'Categories',
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
        ],
    },
    ['/categories/[categoryId]']: {
        title: 'View',
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
        breadcrumbs: [
            {
                title: 'Home',
                pathname: '/',
            },
        ],
    },
    ['/recipes/[recipeId]']: {
        title: 'View',
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
    default: { title: 'Home', isDefault: true },
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
