// /config/index.ts
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
    throw new Error("JWT_SECRET not set in environment variables");
})();

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// We cant set default admin id, because its keep on changing when run locally, it will work fine only in production
export const DEFAULT_ADMIN_ID = process.env.DEFAULT_ADMIN_ID || "4b62bc9f-6cc2-4e22-a932-9f4324b46d0d";