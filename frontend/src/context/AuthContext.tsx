'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { APIURL } from '../config/env';

type Role = 'seller' | 'buyer' | 'admin' | null;
type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'INSPECTOR' | null;

interface UserType {
    id: string;
    name?: string;
    email: string;
    role: Role;
    adminRole?: AdminRole;
    [key: string]: any;
}

interface AuthState {
    authenticated: boolean;
    role: Role;
    adminRole: AdminRole;
    user: UserType | null;
    authLoading: boolean;
    refetch: () => void;
    isAdmin: boolean;
    isSeller: boolean;
    isBuyer: boolean;
    isSuperAdmin: boolean;
    isInspector: boolean;
    isAdminAdmin: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
    authenticated: false,
    role: null,
    adminRole: null,
    user: null,
    authLoading: true,
    refetch: () => { },
    isAdmin: false,
    isSeller: false,
    isBuyer: false,
    isSuperAdmin: false,
    isInspector: false,
    isAdminAdmin: false,
    logout: async () => { },
});

const API_BASE_URL = `${APIURL}/auth`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<Omit<AuthState, 'refetch' | 'isAdmin' | 'isSeller' | 'isBuyer' | 'logout'>>({
        authenticated: false,
        role: null,
        adminRole: null,
        user: null,
        authLoading: true,
        isSuperAdmin: false,
        isInspector: false,
        isAdminAdmin: false,
    });

    const fetchAuth = async () => {
        setState(prev => ({ ...prev, authLoading: true }));
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
                adminRole: data.user.adminRole,
                user: data.user,
                authLoading: false,
                isSuperAdmin: data.user.adminRole === 'SUPER_ADMIN',
                isInspector: data.user.adminRole === 'INSPECTOR',
                isAdminAdmin: data.user.adminRole === 'ADMIN',
            });
        } catch (error) {
            setState({
                authenticated: false,
                role: null,
                adminRole: null,
                user: null,
                authLoading: false,
                isSuperAdmin: false,
                isInspector: false,
                isAdminAdmin: false,
            });

            console.error('Error fetching auth:', error);
        }
        finally {
            setState(prev => {
                if (!prev.authLoading) return prev;
                return { ...prev, authLoading: false };
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
                    logoutURL = `${APIURL}/auth/admin/logout`;
                    break;
                case 'seller':
                    logoutURL = `${APIURL}/seller/logout`;
                    break;
                case 'buyer':
                    logoutURL = `${APIURL}/buyer/logout`;
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
                adminRole: null,
                user: null,
                authLoading: false,
                isSuperAdmin: false,
                isInspector: false,
                isAdminAdmin: false,
            });
        }
    };

    const value: AuthState = {
        ...state,
        refetch: fetchAuth,
        isAdmin: state.role === 'admin',
        isSeller: state.role === 'seller',
        isBuyer: state.role === 'buyer',
        isSuperAdmin: state.adminRole === 'SUPER_ADMIN',
        isInspector: state.adminRole === 'INSPECTOR',
        isAdminAdmin: state.adminRole === 'ADMIN',
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);