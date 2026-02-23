import { API_URL } from "./apiInfo.ts";
import type { Category } from "./categories.ts";

export interface Budget {
    id: number;
    user_id: number;
    category_id: number;
    category: Category;
    maximum: number;
    color: string;
    spent: number;
    remaining: number;
}

export interface BudgetCreate {
    category_name: string;
    maximum: number;
    color: string;
}

export interface BudgetUpdate {
    maximum?: number;
    color?: string;
}

export const getBudgets = async (signal?: AbortSignal): Promise<Budget[]> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/budgets`, {
        signal,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch budgets');
    }

    const data = await response.json();

    return data.map((budget: any) => ({
        ...budget,
        maximum: Number(budget.maximum),
        spent: Number(budget.spent),
        remaining: Number(budget.remaining)
    }));
}

export const createBudget = async (data: BudgetCreate): Promise<Budget> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create budget');
    }

    const budget = await response.json();

    return {
        ...budget,
        maximum: Number(budget.maximum),
        spent: Number(budget.spent),
        remaining: Number(budget.remaining)
    };
}

export const updateBudget = async (id: number, data: BudgetUpdate): Promise<Budget> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update budget');
    }

    const budget = await response.json();

    return {
        ...budget,
        maximum: Number(budget.maximum),
        spent: Number(budget.spent),
        remaining: Number(budget.remaining)
    };
}

export const deleteBudget = async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete budget');
    }
}