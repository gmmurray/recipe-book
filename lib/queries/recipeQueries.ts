import {
    HomepageRecipeResult,
    Recipe,
    RecipeFilter,
    RecipeSort,
    RecipeWithCategory,
} from '../../entities/Recipe';
import {
    axiosDeleteRequest,
    axiosGetRequest,
    axiosPostRequest,
    axiosPutRequest,
} from '../../config/axios';
import { createEndpoint, createQueryEndpoint } from '../../util/createEndpoint';
import { useMutation, useQuery } from 'react-query';

import { ReasonPhrases } from 'http-status-codes';
import { queryClient } from '../../config/queryClient';

export const recipeQueryKeys = {
    all: 'recipes' as const,
    view: (_id: string | null) =>
        [recipeQueryKeys.all, 'view', { _id }] as const,
    search: (filter: RecipeFilter | null, sort: RecipeSort | null) =>
        [recipeQueryKeys.all, 'search', { filter, sort }] as const,
    homepage: () => [recipeQueryKeys.all, 'homepage'] as const,
};

const apiEndpoint = 'api/recipes';

const getRecipe = async (id: string | null) => {
    if (!id) return null;

    return await axiosGetRequest(createEndpoint(apiEndpoint, id));
};
export const useGetRecipeQuery = (id: string | null) =>
    useQuery<Recipe | null>(recipeQueryKeys.view(id), () => getRecipe(id), {
        enabled: !!id,
        retry: false,
    });

const getRecipes = async (
    filter: RecipeFilter | null,
    sort: RecipeSort | null,
) => axiosGetRequest(createQueryEndpoint(apiEndpoint, { ...filter, ...sort }));
export const useGetRecipesQuery = (
    filter: RecipeFilter | null,
    sort: RecipeSort | null,
) =>
    useQuery<RecipeWithCategory[] | null>(
        recipeQueryKeys.search(filter, sort),
        () => getRecipes(filter, sort),
        { retry: false },
    );

const getHomepageRecipes = async (): Promise<HomepageRecipeResult> => {
    const recipes = ((await axiosGetRequest(createEndpoint(apiEndpoint))) ??
        []) as Recipe[];

    const lookup = new Map(recipes.map(r => [r._id, r]));

    const recentlyAdded = recipes
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map(r => r._id);

    const highestRated = recipes
        .sort((a, b) => (a.rating > b.rating ? -1 : 1))
        .map(r => r._id);

    const websiteCounts: Record<string, number> = {};
    try {
        recipes.forEach(r => {
            const hostname = new URL(r.url).hostname;
            websiteCounts[hostname] = (websiteCounts[hostname] ?? 0) + 1;
        });
    } catch (e) {
        console.log('recipe skipped due to invalid url');
    }

    const recommendedWebsites = Object.keys(websiteCounts)
        .map(key => ({ url: key, count: websiteCounts[key] }))
        .sort((a, b) => (a.count > b.count ? -1 : 1))
        .map(item => item.url);

    return {
        lookup,
        recommendedWebsites: recommendedWebsites.slice(0, 5),
        recentlyAdded: recentlyAdded.slice(0, 5),
        highestRated: highestRated.slice(0, 5),
    };
};
export const useGetHomepageRecipes = () =>
    useQuery<HomepageRecipeResult>(
        recipeQueryKeys.homepage(),
        () => getHomepageRecipes(),
        {
            retry: false,
        },
    );

const createRecipe = async (data: Partial<Recipe>) => {
    if (!data.userId) throw new Error(ReasonPhrases.BAD_REQUEST);
    return await axiosPostRequest(apiEndpoint, data);
};
export const useCreateRecipeMutation = () =>
    useMutation((data: Partial<Recipe>) => createRecipe(data), {
        onSuccess: () => queryClient.invalidateQueries(recipeQueryKeys.all),
    });

const updateRecipe = async (data: Recipe) =>
    await axiosPutRequest(createEndpoint(apiEndpoint, data._id), data);
export const useUpdateRecipeMutation = () =>
    useMutation((data: Recipe) => updateRecipe(data), {
        onSuccess: (res: Recipe) =>
            queryClient.invalidateQueries(recipeQueryKeys.all),
    });

const deleteRecipe = async (id: string | null) =>
    await axiosDeleteRequest(createEndpoint(apiEndpoint, id));
export const useDeleteRecipeMutation = () =>
    useMutation((id: string | null) => deleteRecipe(id), {
        onSuccess: () => queryClient.invalidateQueries(recipeQueryKeys.all),
    });
