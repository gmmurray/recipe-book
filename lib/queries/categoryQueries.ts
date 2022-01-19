import {
    Category,
    CategoryFilter,
    CategorySort,
    CategoryWithRecipes,
} from '../../entities/Category';
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

export const categoryQueryKeys = {
    all: 'categories' as const,
    view: (_id: string | null) =>
        [categoryQueryKeys.all, 'view', { _id }] as const,
    search: (filter: CategoryFilter | null, sort: CategorySort | null) =>
        [categoryQueryKeys.all, 'search', { filter, sort }] as const,
};

const apiEndpoint = 'api/categories';

const getCategory = async (id: string | null) => {
    if (!id) return null;

    return await axiosGetRequest(apiEndpoint + '/' + id);
};
export const useGetCategory = (id: string | null) =>
    useQuery<Category | null>(
        categoryQueryKeys.view(id),
        () => getCategory(id),
        {
            enabled: !!id,
            retry: false,
        },
    );

const getCategories = async (
    filter: CategoryFilter | null,
    sort: CategorySort | null,
) =>
    axiosGetRequest(
        createQueryEndpoint(apiEndpoint, {
            ...(filter ?? {}),
            ...(sort ?? {}),
        }),
    );
export const useGetCategories = (
    filter: CategoryFilter | null,
    sort: CategorySort | null,
) =>
    useQuery<CategoryWithRecipes[] | null>(
        categoryQueryKeys.search(filter, sort),
        () => getCategories(filter, sort),
        { retry: false },
    );

const createCategory = async (data: Partial<Category>) => {
    if (!data.userId) throw new Error(ReasonPhrases.BAD_REQUEST);
    return await axiosPostRequest(apiEndpoint, data);
};
export const useCreateCategory = () =>
    useMutation((data: Partial<Category>) => createCategory(data), {
        onSuccess: () => queryClient.invalidateQueries(categoryQueryKeys.all),
    });

const updateCategory = async (data: Category) =>
    await axiosPutRequest(createEndpoint(apiEndpoint, data._id), data);
export const useUpdateCategory = () =>
    useMutation((data: Category) => updateCategory(data), {
        onSuccess: (res: Category) =>
            queryClient.invalidateQueries(categoryQueryKeys.view(res._id)),
    });

const deleteCategory = async (id: string | null) =>
    await axiosDeleteRequest(apiEndpoint + '/' + id);

export const useDeleteCategory = () =>
    useMutation((id: string | null) => deleteCategory(id), {
        onSuccess: () => queryClient.invalidateQueries(categoryQueryKeys.all),
    });
