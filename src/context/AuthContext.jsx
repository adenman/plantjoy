import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/plantjoy/api/check_session.php')
            .then(res => res.json())
            .then(data => {
                if (data.isLoggedIn) {
                    setUser(data.user);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        fetch('/plantjoy/api/logout.php').then(() => setUser(null));
    };
    
    // Check if the user object includes is_admin: 1
    const isAdmin = user && user.is_admin === 1;

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);