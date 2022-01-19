import { Recipe } from './Recipe';

export interface Category {
    _id: string | null; // stored as objectid in db
    userId: string;
    name: string;
}

export interface CategoryWithRecipes extends Category {
    recipes: Recipe[];
}

export interface CategoryFilter {
    name?: Category['name'];
}

export const defaultCategoryFilter: CategoryFilter = {
    name: undefined,
};

export interface CategorySort {
    sortField: 'name' | 'recipes';
    sortDir: 'asc' | 'desc';
}

export const defaultCategorySort: CategorySort = {
    sortField: 'name',
    sortDir: 'asc',
};

export const categoriesCollection = 'categories';
