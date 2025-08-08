/*
  Warnings:

  - You are about to drop the column `isDraft` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isDraft";
