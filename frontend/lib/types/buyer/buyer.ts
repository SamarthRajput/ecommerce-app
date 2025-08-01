
export interface LoginFormData {
    email: string;
    password: string;
}

export interface Buyer {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    createdAt: Date;
    
}

export interface LoginResponse {
    _id: string;
    message: string;
    buyer: Buyer;
    firstName: string;
    lastName: string;
    token: string;
}

export interface BuyerDetails {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}


interface BuyerProfile {
    id: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
}
export type { BuyerProfile };