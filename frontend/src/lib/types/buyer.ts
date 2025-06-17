
export interface LoginFormData {
    email: string;
    password: string;
}

export interface Buyer {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginResponse {
    _id: string;
    message: string;
    buyer: Buyer;
    firstName: string;
    lastName: string;
    token: string;
}