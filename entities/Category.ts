export interface Category {
    _id: string | null; // stored as objectid in db
    userId: string;
    name: string;
}

export const categoriesCollection = 'categories';
