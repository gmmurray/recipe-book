import {
    axiosDeleteRequest,
    axiosGetRequest,
    axiosPostRequest,
    axiosPutRequest,
} from '../../config/axios';
import { useMutation, useQuery } from 'react-query';

import { Category } from '../../entities/Category';
import { ReasonPhrases } from 'http-status-codes';
import { queryClient } from '../../config/queryClient';

export const categoryQueryKeys = {
    all: 'categories' as const,
    view: (_id: string | null) =>
        [categoryQueryKeys.all, 'view', { _id }] as const,
    search: (name: string | null) =>
        [categoryQueryKeys.all, 'search', { name }] as const,
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

const getCategories = async (name: string | null) =>
    axiosGetRequest(apiEndpoint + `${name ? `?name=${encodeURI(name)}` : ''}`);
export const useGetCategories = (name: string | null) =>
    useQuery<Category[] | null>(
        categoryQueryKeys.search(name),
        () => getCategories(name),
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
    await axiosPutRequest(apiEndpoint, data);
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
