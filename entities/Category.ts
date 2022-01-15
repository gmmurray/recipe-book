export interface Category {
    _id: string; // stored as objectid in db
    userId: string;
    name: string;
}

export const categoriesCollection = 'categories';
