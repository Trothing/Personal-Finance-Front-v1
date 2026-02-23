import {createContext, useState, useEffect, type ReactNode, useMemo, useCallback} from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface NavbarContextType {
    isMinimized: boolean;
    toggleMinimize: () => void;
    setIsMinimized: (value: boolean) => void;
}

export const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

interface NavbarProviderProps {
    children: ReactNode;
}

export const NavbarProvider = ({children}: NavbarProviderProps) =>{
    const [isMinimized, setIsMinimized] = useState<boolean>(() => {
        const saved = localStorage.getItem('navbarMinimized');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const isTablet = useMediaQuery(1024)
    useEffect(() => {
        if (isTablet) {
            setIsMinimized(false);
        }
    }, [isTablet]);



    useEffect(() => {
        localStorage.setItem('navbarMinimized', JSON.stringify(isMinimized));
    }, [isMinimized]);


    const toggleMinimize = useCallback(() => {
        setIsMinimized(prev => !prev);
    }, []);

    const value = useMemo(
        () => ({ isMinimized, setIsMinimized, toggleMinimize }),
        [isMinimized, toggleMinimize]
    );

    return(
        <NavbarContext.Provider
            value={value}
        >
            {children}
        </NavbarContext.Provider>
    )

}

