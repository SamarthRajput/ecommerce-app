import { Response } from "express";

type AuthTokenType = "SellerToken" | "BuyerToken" | "AdminToken";

const DEFAULT_COOKIE_NAMES: AuthTokenType[] = ["SellerToken", "BuyerToken", "AdminToken"];

export const clearAuthCookies = (res: Response) => {
    const isProduction = process.env.NODE_ENV === "production";

    const commonCookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" as const : "strict" as const,
        path: "/", // ensure proper clearing
    };

    for (const cookieName of DEFAULT_COOKIE_NAMES) {
        res.clearCookie(cookieName, commonCookieOptions);
    }
};