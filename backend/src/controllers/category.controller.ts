import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({});
        const categoryIds = categories.map(category => category.id);
        const response = res.status(200).json({
            message: "All category Ids are sent ",
            categoryIds
        });
        console.log(response);
    }
    catch(err){
        console.log("Error occured", err);
        return;
    }
}