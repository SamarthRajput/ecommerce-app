import { prisma } from "../lib/prisma";

const OTHERS = "Others";

const ensureOthers = async () => {
    const [categoryExists, IndustryExists] = await Promise.all([
        prisma.category.findUnique({ where: { name: OTHERS } }),
        prisma.industry.findUnique({ where: { name: OTHERS } }),
    ]);
    if (!categoryExists) {
        await prisma.category.upsert({
            where: { name: OTHERS },
            update: {},
            create: { name: OTHERS },
        });
    }
    if (!IndustryExists) {
        await prisma.industry.upsert({
            where: { name: OTHERS },
            update: {},
            create: { name: OTHERS },
        });
    }
};

const getOthersID = async ({ types }: { types: 'category' | 'industry' }) => {
    await ensureOthers();
    const [category, industry] = await Promise.all([
        prisma.category.findUnique({ where: { name: OTHERS } }),
        prisma.industry.findUnique({ where: { name: OTHERS } }),
    ]);
    return types === 'category' ? category?.id : industry?.id;
};

const CategoryService = {
    add: async ({ name }: { name: string }) => {
        try {
            // Check if category already exists
            const existingCategory = await prisma.category.findUnique({
                where: { name },
            });
            if (existingCategory) {
                throw new Error(`Category ${name} already exists`);
            }
            // Ensure "Others" category exists
            await ensureOthers();
            await prisma.category.create({
                data: { name },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    delete: async ({ id }: { id: string }) => {
        try {
            const category = await prisma.category.findUnique({ where: { id } });
            if (category?.name === 'Others') {
                throw new Error('Cannot delete category "Others"');
            }
            // Transfer products to "Others" category
            const othersId = await getOthersID({ types: 'category' });
            await prisma.$transaction([
                prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: othersId } }),
                prisma.category.delete({ where: { id } }),
            ]);
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    edit: async ({ id, name }: { id: string; name: string }) => {
        try {
            await prisma.category.update({
                where: { id },
                data: { name },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
};

const IndustryService = {
    add: async ({ name }: { name: string }) => {
        try {
            const exists = await prisma.industry.findUnique({ where: { name } });
            if (exists) throw new Error(`Industry ${name} already exists`);
            await prisma.industry.create({ data: { name } });
            // for (const option of industryOptions) {
            //     if (option !== name) {
            //         await prisma.industry.upsert({
            //             where: { name: option },
            //             update: {},
            //             create: { name: option },
            //         });
            //     }
            // }
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    delete: async ({ id }: { id: string }) => {
        try {
            const industry = await prisma.industry.findUnique({ where: { id } });
            if (industry?.name === OTHERS) throw new Error(`Cannot delete ${OTHERS}`);

            const othersId = await getOthersID({ types: 'industry' });
            await prisma.$transaction([
                prisma.product.updateMany({ where: { industryId: id }, data: { industryId: othersId } }),
                prisma.seller.updateMany({ where: { industryId: id }, data: { industryId: othersId } }),
                prisma.industry.delete({ where: { id } })
            ]);
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    edit: async ({ id, name }: { id: string; name: string }) => {
        try {
            await prisma.industry.update({
                where: { id },
                data: { name },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
};

const Unit = {
    add: async ({ name, symbol }: { name: string; symbol?: string }) => {
        try {
            await prisma.unit.create({
                data: { name, symbol },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    delete: async ({ id }: { id: string }) => {
        try {
            // find any product / rfq use this or not
            const [rfqs, products] = await Promise.all([
                prisma.rFQ.findMany({ where: { unitId: id } }),
                prisma.product.findMany({ where: { unitId: id } }),
            ]);
            if (rfqs.length > 0 || products.length > 0) {

            }
            await prisma.unit.delete({
                where: { id },
            });
        } catch (error: any) {
            console.error('Error deleting unit:', error);
            throw new Error(error.message);
        }
    },
    edit: async ({ id, name, symbol }: { id: string; name: string; symbol?: string }) => {
        try {
            await prisma.unit.update({
                where: { id },
                data: { name, symbol },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
};

export const MasterDataService = {
    Category: CategoryService,
    Industry: IndustryService,
    Unit: Unit,
};

export default MasterDataService;

// const industryOptions = [
//     'Agriculture', 'Manufacturing', 'Technology', 'Healthcare', 'Education',
//     'Financial Services', 'Real Estate', 'Retail', 'Transportation', 'Energy',
//     'Construction', 'Food & Beverage', 'Textiles', 'Chemicals', 'Automotive'
// ];
