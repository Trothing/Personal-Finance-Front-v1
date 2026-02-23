import { useState, useEffect } from 'react';

export const useMediaQuery = (maxWidth: number): boolean => {
    const [isMatch, setIsMatch] = useState(window.innerWidth <= maxWidth);

    useEffect(() => {
        const handleResize = () => {
            setIsMatch(window.innerWidth <= maxWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [maxWidth]);

    return isMatch;
};