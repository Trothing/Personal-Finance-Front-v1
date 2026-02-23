import { createContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';
import type { LoginData, RegisterData, UserResponse } from '../api/auth';

interface AuthContextType{
    user: UserResponse | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () =>{
            const token = localStorage.getItem('access_token')

            if(token){
                try {
                    const userData = await getCurrentUser()
                    setUser(userData)
                }catch (error){
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('access_token');
                }
            }

            setLoading(false);
        }
        initAuth()
    }, []);

    const login = async(data: LoginData)=>{
        try{
            const response = await apiLogin(data)
            localStorage.setItem('access_token', response.access_token);

            const userData = await getCurrentUser()
            setUser(userData)
        }catch (error){
            throw error
        }
    }
    const register = async (data: RegisterData) => {
        try{
            await apiRegister(data)

            await login({username: data.username, password: data.password})
        }catch (error){
            throw error
        }
    }
    const logout = () => {
        localStorage.removeItem('access_token')
        setUser(null)
    }

    return(
        <AuthContext.Provider
            value={{
                user, loading, login, register, logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}