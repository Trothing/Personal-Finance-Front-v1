import { API_URL } from "./apiInfo.ts";

export interface Pot {
    id: number;
    name: string;
    user_id: number;
    target: number;
    saved: number;
    color: string;
    created_at: string;
}

export interface PotCreate {
    name: string;
    target: number;
    color: string;
}

export interface PotUpdate {
    name?: string;
    target?: number;
    color?: string;
}

export interface AvailableBalance {
    available_balance: number;
}

export const getPots = async (signal?: AbortSignal): Promise<Pot[]> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots`, {
        signal,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch pots');
    }

    const data = await response.json();

    return data.map((pot: any) => ({
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    }));
}

export const getPot = async (id: number, signal?: AbortSignal): Promise<Pot> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/${id}`, {
        signal,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch pot');
    }

    const pot = await response.json();

    return {
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    };
}

export const createPot = async (data: PotCreate): Promise<Pot> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create pot');
    }

    const pot = await response.json();

    return {
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    };
}

export const updatePot = async (id: number, data: PotUpdate): Promise<Pot> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update pot');
    }

    const pot = await response.json();

    return {
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    };
}

export const deletePot = async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete pot');
    }
}

export const addMoneyToPot = async (id: number, amount: number): Promise<Pot> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/${id}/add?amount=${amount}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add money to pot');
    }

    const pot = await response.json();

    return {
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    };
}

export const withdrawMoneyFromPot = async (id: number, amount: number): Promise<Pot> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/${id}/withdraw?amount=${amount}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to withdraw money from pot');
    }

    const pot = await response.json();

    return {
        ...pot,
        target: Number(pot.target),
        saved: Number(pot.saved)
    };
}

export const getAvailableBalance = async (signal?: AbortSignal): Promise<AvailableBalance> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/pots/balance/available`, {
        signal,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch available balance');
    }

    return response.json();
}