import {API_URL} from "./apiInfo.ts";
import type {Category} from "./categories.ts";



export const TransactionSort = {
    LATEST: 'latest',
    OLDEST: 'oldest',
    NAME_ASC: 'a-z',
    NAME_DESC: 'z-a',
    AMOUNT_DESC: 'highest',
    AMOUNT_ASC: 'lowest'
} as const;

export type TransactionSort = typeof TransactionSort[keyof typeof TransactionSort];

export interface Transaction{
    id: number;
    user_id: number;
    date: string;
    amount: number;
    category_id: number;
    category: Category;
    description: string | null;
    type: 'income' | 'expense';
    recurring: boolean;
    counterparty_name: string;
    counterparty_avatar_url: string;
}
export interface TransactionFilters {
    skip: number;
    limit: number;
    search?: string | null;
    sort?: TransactionSort;
    type?: 'income' | 'expense' | null;
    category_id?: number | null;
}
export interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
}

export const getTransactions = async (
    filters: TransactionFilters,
    signal?: AbortSignal
): Promise<TransactionsResponse> => {
    const token = localStorage.getItem('access_token')

    if(!token){
        throw new Error('No token found')
    }

    const params = new URLSearchParams({
        skip: filters.skip.toString(),
        limit: filters.limit.toString(),
        sort: filters.sort || TransactionSort.LATEST
    })

    if(filters.type){
        params.append('type', filters.type)
    }
    if (filters.category_id) {
        params.append('category_id', filters.category_id.toString());
    }

    if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
    }


    const response = await fetch(`${API_URL}/finance/transactions?${params}`, {
        signal,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if(!response.ok){
        throw new Error('Failed to fetch transactions');
    }
    const data = await response.json()

    if (Array.isArray(data)) {
        return {
            transactions: data,
            total: data.length
        };
    }

    return data;
}