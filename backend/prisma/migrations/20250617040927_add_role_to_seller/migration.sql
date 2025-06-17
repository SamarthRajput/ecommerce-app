/*
  Warnings:

  - Added the required column `role` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ProductStatus" ADD VALUE 'PENDING';
ALTER TYPE "ProductStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "role" TEXT NOT NULL;
