
export interface LoginFormData {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    role: 'seller' | 'admin';
    profile: {
        firstName: string;
        lastName: string;
        businessName?: string;
    };
}

export interface LoginResponse {
    message: string;
    seller: User;
    token: string;
}