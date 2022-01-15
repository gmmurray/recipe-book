export interface Recipe {
    _id: string; // stored as objectid in db
    userId: string; // stored as objectid in db
    categoryId?: string | null; // stored as objectid in db
    name: string;
    notes: string;
    rating: number;
    createdAt: Date;
}

export interface RecipeFilter {
    categoryId?: Recipe['categoryId'];
    name?: Recipe['name'];
    notes?: Recipe['notes'];
    rating?: Recipe['rating'];
}

export const recipesCollection = 'recipes';
