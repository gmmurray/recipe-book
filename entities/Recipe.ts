import { Category } from './Category';

export interface Recipe {
    _id: string; // stored as objectid in db
    userId: string; // stored as objectid in db
    categoryId?: string | null; // stored as objectid in db
    name: string;
    notes: string;
    rating: number;
    url: string;
    createdAt: Date;
}

export interface RecipeWithCategory extends Recipe {
    category: Category | null;
}

export interface RecipeFilter {
    categoryId?: Recipe['categoryId'] | Recipe['categoryId'][];
    name?: Recipe['name'];
    notes?: Recipe['notes'];
    rating?: Recipe['rating'];
}

export const defaultRecipeFilter: RecipeFilter = {
    categoryId: undefined,
    name: undefined,
    notes: undefined,
    rating: undefined,
};

export interface RecipeSort {
    sortField: 'name' | 'category' | 'rating';
    sortDir: 'asc' | 'desc';
}

export const defaultRecipeSort: RecipeSort = {
    sortField: 'name',
    sortDir: 'asc',
};

export interface HomepageRecipeResult {
    lookup: Map<string, Recipe>;
    recommendedWebsites: string[];
    recentlyAdded: string[];
    highestRated: string[];
}

export const recipesCollection = 'recipes';
