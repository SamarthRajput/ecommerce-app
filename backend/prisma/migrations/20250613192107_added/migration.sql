/*
  Warnings:

  - Changed the type of `status` on the `RFQ` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "RFQ" DROP COLUMN "status",
ADD COLUMN     "status" "RFQStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "status",
ADD COLUMN     "status" "TradeStatus" NOT NULL;
