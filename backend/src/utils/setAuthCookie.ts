// /utils/setAuthCookie.ts
import { Response } from "express";

export const setAuthCookie = ({
    res,
    token,
    cookieName = "BuyerToken",
    maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
}: {
    res: Response,
    token: string,
    cookieName?: "SellerToken" | "BuyerToken" | "AdminToken" | string,
    maxAge?: number
}) => {
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge
    });
};
