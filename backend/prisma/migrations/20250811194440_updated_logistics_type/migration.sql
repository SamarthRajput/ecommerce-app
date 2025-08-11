/*
  Warnings:

  - The values [SELF,BOTH] on the enum `LogisticsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LogisticsType_new" AS ENUM ('SELLER', 'INTERLINK', 'BUYER');
ALTER TABLE "Product" ALTER COLUMN "logisticsSupport" TYPE "LogisticsType_new" USING ("logisticsSupport"::text::"LogisticsType_new");
ALTER TYPE "LogisticsType" RENAME TO "LogisticsType_old";
ALTER TYPE "LogisticsType_new" RENAME TO "LogisticsType";
DROP TYPE "LogisticsType_old";
COMMIT;
