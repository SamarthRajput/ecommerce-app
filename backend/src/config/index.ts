// /config/index.ts
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
    throw new Error("JWT_SECRET not set in environment variables");
})();

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const DEFAULT_ADMIN_ID = process.env.DEFAULT_ADMIN_ID || "4b62bc9f-6cc2-4e22-a932-9f4324b46d0d";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || (() => {
    throw new Error("CLOUDINARY_CLOUD_NAME not set in environment variables");
})();

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || (() => {
    throw new Error("CLOUDINARY_API_KEY not set in environment variables");
})();

export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || (() => {
    throw new Error("CLOUDINARY_API_SECRET not set in environment variables");
})();