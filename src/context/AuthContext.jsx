import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('studyroad_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('studyroad_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('studyroad_user');
        }
    }, [currentUser]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'การเข้าสู่ระบบล้มเหลว');

            setCurrentUser(data.user);
            setIsAuthModalOpen(false);
            return data.user;
        } catch (err) {
            throw err;
        }
    };

    const register = async (email, password, full_name) => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'การสมัครสมาชิกล้มเหลว');

            setCurrentUser(data.user);
            setIsAuthModalOpen(false);
            return data.user;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('studyroad_user');
    };

    const openAuthModal = (message = 'กรุณาสมัครสมาชิกหรือเข้าสู่ระบบเพื่อเข้าชม/สั่งซื้อไฟล์สรุป') => {
        setAuthModalMessage(message);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthModalMessage('');
    };

    const isLoggedIn = !!currentUser;
    const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'satetapongs@gmail.com';

    useEffect(() => {
        if (currentUser) {
            try {
                localStorage.setItem('studyroad_user', JSON.stringify(currentUser));
            } catch (e) {
                console.error('Failed to save studyroad_user:', e);
            }
        } else {
            localStorage.removeItem('studyroad_user');
        }
    }, [currentUser]);

    const updateProfile = (updatedFields) => {
        setCurrentUser(prev => {
            const newUser = { ...prev, ...updatedFields };
            try {
                localStorage.setItem('studyroad_user', JSON.stringify(newUser));
            } catch (e) {
                console.error('Failed to update studyroad_user:', e);
            }
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isLoggedIn,
            isAdmin,
            login,
            register,
            logout,
            updateProfile,
            isAuthModalOpen,
            authModalMessage,
            openAuthModal,
            closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
