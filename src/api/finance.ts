import {API_URL} from "./apiInfo.ts";

interface Balance{
    available_balance: number,
    incomes: number,
    expenses: number,
    pots_total: number
}

export const get_balance = async (): Promise<Balance> =>{
    const token = localStorage.getItem('access_token')

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/balance/available`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get balance');
    }

    return response.json()
}