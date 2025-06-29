// /utils/setAuthCookie.ts
import { Response } from "express";

type AuthTokenType = "SellerToken" | "BuyerToken" | "AdminToken" | string;

interface SetAuthCookieParams {
    res: Response;
    token: string;
    cookieName?: AuthTokenType;
    maxAge?: number;
}

const DEFAULT_COOKIE_NAMES: AuthTokenType[] = ["SellerToken", "BuyerToken", "AdminToken"];

export const setAuthCookie = ({
    res,
    token,
    cookieName = "BuyerToken",
    maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
}: SetAuthCookieParams) => {

    const commonCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const
    };

    // Clear all existing auth cookies
    for (const name of DEFAULT_COOKIE_NAMES) {
        res.clearCookie(name, commonCookieOptions);
    }

    // Set new auth cookie
    res.cookie(cookieName, token, {
        ...commonCookieOptions,
        maxAge
    });
};
