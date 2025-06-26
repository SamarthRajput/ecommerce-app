'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';

type Role = 'seller' | 'buyer' | 'admin' | null;

interface UserType {
    id: string;
    name?: string;
    email: string;
    [key: string]: any;
}

interface AuthState {
    authenticated: boolean;
    role: Role;
    user: UserType | null;
    loading: boolean;
    refetch: () => void;
    isAdmin: boolean;
    isSeller: boolean;
    isBuyer: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
    authenticated: false,
    role: null,
    user: null,
    loading: true,
    refetch: () => { },
    isAdmin: false,
    isSeller: false,
    isBuyer: false,
    logout: async () => { },
});

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/auth`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<Omit<AuthState, 'refetch' | 'isAdmin' | 'isSeller' | 'isBuyer' | 'logout'>>({
        authenticated: false,
        role: null,
        user: null,
        loading: true,
    });

    const fetchAuth = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/me`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok || !data.authenticated) {
                throw new Error(data?.error || 'Not authenticated');
            }

            setState({
                authenticated: true,
                role: data.role,
                user: data.user,
                loading: false,
            });
        } catch (err) {
            console.error('Auth fetch failed:', err);
            setState({
                authenticated: false,
                role: null,
                user: null,
                loading: false,
            });
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

    const logout = async () => {
        try {
            let logoutURL = '';

            switch (state.role) {
                case 'admin':
                    logoutURL = `${API_BACKEND_URL}/auth/admin/logout`;
                    break;
                case 'seller':
                    logoutURL = `${API_BACKEND_URL}/seller/logout`;
                    break;
                case 'buyer':
                    logoutURL = `${API_BACKEND_URL}/buyer/logout`;
                    break;
                default:
                    console.warn('No role found, skipping logout API call.');
                    break;
            }

            if (logoutURL) {
                await fetch(logoutURL, {
                    method: 'POST',
                    credentials: 'include',
                });
            }
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setState({
                authenticated: false,
                role: null,
                user: null,
                loading: false,
            });
        }
    };

    const value: AuthState = {
        ...state,
        refetch: fetchAuth,
        isAdmin: state.role === 'admin',
        isSeller: state.role === 'seller',
        isBuyer: state.role === 'buyer',
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
