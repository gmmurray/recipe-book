import { Recipe, RecipeFilter } from '../../entities/Recipe';
import {
    axiosDeleteRequest,
    axiosGetRequest,
    axiosPostRequest,
    axiosPutRequest,
} from '../../config/axios';
import { createEndpoint, createQueryEndpoint } from '../../util/createEndpoint';
import { useMutation, useQuery } from 'react-query';

import { ReasonPhrases } from 'http-status-codes';
import { categoryQueryKeys } from './categoryQueries';
import { queryClient } from '../../config/queryClient';

export const recipeQueryKeys = {
    all: 'recipes' as const,
    view: (_id: string | null) =>
        [recipeQueryKeys.all, 'view', { _id }] as const,
    search: (filter: RecipeFilter | null) =>
        [recipeQueryKeys.all, 'search', { filter }] as const,
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

const getRecipes = async (filter: RecipeFilter | null) =>
    axiosGetRequest(createQueryEndpoint(apiEndpoint, filter));
export const useGetRecipesQuery = (filter: RecipeFilter | null) =>
    useQuery<Recipe[] | null>(
        recipeQueryKeys.search(filter),
        () => getRecipes(filter),
        { retry: false },
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
    await axiosPutRequest(apiEndpoint, data);
export const useUpdateRecipeMutation = () =>
    useMutation((data: Recipe) => updateRecipe(data), {
        onSuccess: (res: Recipe) =>
            queryClient.invalidateQueries(categoryQueryKeys.view(res._id)),
    });

const deleteRecipe = async (id: string | null) =>
    await axiosDeleteRequest(createEndpoint(apiEndpoint, id));
export const useDeleteRecipeMutation = () =>
    useMutation((id: string | null) => deleteRecipe(id), {
        onSuccess: () => queryClient.invalidateQueries(categoryQueryKeys.all),
    });
