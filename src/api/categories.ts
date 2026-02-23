import { API_URL } from "./apiInfo.ts";

export interface Category {
    id: number;
    name: string;
    user_id: number;
    created_at: string;
}

export interface CategoryCreate {
    name: string;
}

export interface CategoryUpdate {
    name?: string;
}

export const getCategories = async (signal?: AbortSignal): Promise<Category[]> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/categories`, {
        signal,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    return response.json();
};


export const createCategory = async (data: CategoryCreate): Promise<Category> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create category');
    }

    return response.json();
};


export const updateCategory = async (id: number, data: CategoryUpdate): Promise<Category> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update category');
    }

    return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete category');
    }
};