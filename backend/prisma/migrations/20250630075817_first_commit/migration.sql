/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `businessType` on the `Seller` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'NGO', 'GOVERNMENT_ENTITY', 'OTHER');

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "approvalNote" TEXT,
ADD COLUMN     "businessDocUrl" TEXT,
ADD COLUMN     "govIdUrl" TEXT,
ADD COLUMN     "gstCertUrl" TEXT,
ADD COLUMN     "industryTags" TEXT[],
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedIn" TEXT,
ADD COLUMN     "registrationNo" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "yearsInBusiness" INTEGER,
ALTER COLUMN "role" SET DEFAULT 'seller',
DROP COLUMN "businessType",
ADD COLUMN     "businessType" "BusinessType" NOT NULL,
ALTER COLUMN "taxId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_phone_key" ON "Seller"("phone");
