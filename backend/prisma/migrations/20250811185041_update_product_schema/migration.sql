/*
  Warnings:

  - The values [RENT] on the enum `ListingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListingType_new" AS ENUM ('SELL', 'LEASE');
ALTER TABLE "Product" ALTER COLUMN "listingType" TYPE "ListingType_new" USING ("listingType"::text::"ListingType_new");
ALTER TYPE "ListingType" RENAME TO "ListingType_old";
ALTER TYPE "ListingType_new" RENAME TO "ListingType";
DROP TYPE "ListingType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "model" DROP NOT NULL;
