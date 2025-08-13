import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Category, Industry, Unit } from "@prisma/client";

function moveOthersLast<T extends { name: string }>(list: T[]): T[] {
    return list.sort((a, b) => {
        if (a.name === 'Others') return 1;
        if (b.name === 'Others') return -1;
        return a.name.localeCompare(b.name);
    });
}
function movePieceLast<T extends { name: string }>(list: T[]): T[] {
    return list.sort((a, b) => {
        if (a.name === 'Piece') return 1;
        if (b.name === 'Piece') return -1;
        return a.name.localeCompare(b.name);
    });
}

// master data
export const getMasterdata = async (req: Request, res: Response) => {
    try {
        // read query params
        const { includeCategories, includeIndustries, includeUnits } = req.query;
        let categories: Category[] = [];
        let industries: Industry[] = [];
        let units: Unit[] = [];

        // if no query params are provided, return all data
        if (!includeCategories && !includeIndustries && !includeUnits) {
            categories = moveOthersLast(await prisma.category.findMany({ orderBy: { name: 'asc' } }));
            industries = moveOthersLast(await prisma.industry.findMany({ orderBy: { name: 'asc' } }));
            units = movePieceLast(await prisma.unit.findMany({ orderBy: { name: 'asc' } }));
        } else {
            // if includeCategories is true, fetch categories
            if (includeCategories === 'true') {
                categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
            }

            // if includeIndustries is true, fetch industries
            if (includeIndustries === 'true') {
                industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } });
            }

            // if includeUnits is true, fetch units
            if (includeUnits === 'true') {
                units = await prisma.unit.findMany({ orderBy: { name: 'asc' } });
            }
        }

        res.json({
            success: true,
            message: "Master data fetched successfully",
            data: {
                categories,
                industries,
                units
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};