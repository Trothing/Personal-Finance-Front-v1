import {API_URL} from "./apiInfo.ts";


export interface RegisterData{
    username: string;
    email:string;
    password: string;
    role?: 'user' | 'admin';
}
export interface LoginData{
    username: string;
    password: string;
}
export interface TokenResponse {
    access_token: string;
    token_type: string;
}
export interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    avatar_url: string;
    created_at: string;
}

export const register = async (data: RegisterData): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
};
export const login = async (data: LoginData): Promise<TokenResponse> => {

    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)

    const response = await fetch(`${API_URL}/token`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
    if(!response.ok){
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }
    return response.json();
}
export const getCurrentUser = async (): Promise<UserResponse> => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/me/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
};
