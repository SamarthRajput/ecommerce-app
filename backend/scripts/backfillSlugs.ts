// scripts/backfillSlugs.ts
// To run this file, use the command: `npx tsx scripts/backfillSlugs.ts`
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();

    // for (const product of products) {
    //     const slug = slugify(product.name, { lower: true, strict: true });
    //     await prisma.product.update({
    //         where: { id: product.id },
    //         data: { slug: slug },
    //     });
    // }
    // print products with slugs
    for (const product of products) {
        console.log(`Product: ${product.name}, Slug: ${product.slug}`);
    }
    const deleteMessages = await prisma.chatMessage.deleteMany();
    console.log(`Deleted ${deleteMessages.count} messages.`);
    // delete all chatrooms and messages before deleting products
    const deleteChatRooms = await prisma.chatRoom.deleteMany();
    console.log(`Deleted ${deleteChatRooms.count} chat rooms.`);
    // delete all rfqs before deleting products
    const deleteRfqs = await prisma.rFQ.deleteMany();
    console.log(`Deleted ${deleteRfqs.count} RFQs.`);

    // delete all reviews before deleting products
    const deleteReviews = await prisma.review.deleteMany();
    console.log(`Deleted ${deleteReviews.count} reviews.`);

    // Delete all products
    const deleteResult = await prisma.product.deleteMany();
    console.log(`Deleted ${deleteResult.count} products.`);
    console.log(`Deleted products:`, deleteResult);
    console.log('All products deleted.');

    console.log('Slugs backfilled!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
