// /config/index.ts
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
    throw new Error("JWT_SECRET not set in environment variables");
})();

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const DEFAULT_ADMIN_ID = process.env.DEFAULT_ADMIN_ID || "7d12917a-6a44-4756-8f32-ef640deb926f";