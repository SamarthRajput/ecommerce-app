/*
  Warnings:

  - The values [ACTIVE] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `logisticsSupport` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `listingType` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `condition` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `slug` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SELL', 'LEASE', 'RENT');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'REFURBISHED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "LogisticsType" AS ENUM ('SELF', 'INTERLINK', 'BOTH');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('INACTIVE', 'ARCHIVED', 'APPROVED', 'PENDING', 'REJECTED', 'EXPIRED');
ALTER TABLE "Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "RFQ" DROP CONSTRAINT "RFQ_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "listingType",
ADD COLUMN     "listingType" "ListingType" NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" "ProductCondition" NOT NULL,
DROP COLUMN "logisticsSupport",
ADD COLUMN     "logisticsSupport" "LogisticsType",
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "slug" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
