import { prisma } from "../lib/prisma";

const OTHERS = "Others";
const PIECE = "Piece";

const ensureOthers = async () => {
    const [categoryExists, industryExists] = await Promise.all([
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
    if (!industryExists) {
        await prisma.industry.upsert({
            where: { name: OTHERS },
            update: {},
            create: { name: OTHERS },
        });
    }
};
const ensurePiece = async () => {
    // In Units ensure piece
    const pieceExists = await prisma.unit.findUnique({ where: { name: PIECE } });
    if (!pieceExists) {
        await prisma.unit.create({ data: { name: PIECE } });
    }
}

const getOthersID = async ({ types }: { types: 'category' | 'industry' | 'unit' }) => {
    await ensureOthers();
    await ensurePiece();
    const [category, industry, unit] = await Promise.all([
        prisma.category.findUnique({ where: { name: OTHERS } }),
        prisma.industry.findUnique({ where: { name: OTHERS } }),
        prisma.unit.findUnique({ where: { name: PIECE } }),
    ]);

    return types === 'category' ? category?.id : types === 'industry' ? industry?.id : unit?.id;
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
            // Can not edit "Others" , check with id
            const category = await prisma.category.findUnique({ where: { id } });
            if (category?.name === 'Others') {
                throw new Error('Cannot edit category "Others"');
            }
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
            // Can not edit "Others"
            const industry = await prisma.industry.findUnique({ where: { id } });
            if (industry?.name === 'Others') {
                throw new Error('Cannot edit industry "Others"');
            }
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
            await ensurePiece();
            await prisma.unit.create({
                data: { name, symbol },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    delete: async ({ id }: { id: string }) => {
        try {
            // check if delete request is not for "Piece"
            const isPiece = await prisma.unit.findUnique({ where: { id } });
            if (isPiece?.name === 'Piece') {
                throw new Error('Cannot delete unit "Piece"');
            }
            const pieceId = await getOthersID({ types: 'unit' });
            await prisma.$transaction([
                prisma.rFQ.updateMany({ where: { unitId: id }, data: { unitId: pieceId } }),
                prisma.product.updateMany({ where: { unitId: id }, data: { unitId: pieceId } }),
                prisma.unit.delete({ where: { id } }),
            ]);
        } catch (error: any) {
            console.error('Error deleting unit:', error);
            throw new Error(error.message);
        }
    },
    edit: async ({ id, name, symbol }: { id: string; name: string; symbol?: string }) => {
        try {
            // Can not edit "Piece"
            const unit = await prisma.unit.findUnique({ where: { id } });
            if (unit?.name === 'Piece') {
                throw new Error('Cannot edit unit "Piece"');
            }
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


