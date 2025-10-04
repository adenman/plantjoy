import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/BoothPortal/api/check_session.php')
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
        fetch('/BoothPortal/api/logout.php').then(() => {
            setUser(null);
            // Optionally redirect to home or login page after logout
            window.location.href = '/BoothPortal/login';
        });
    };
    
    // Check if the user's role is 'admin'
    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);