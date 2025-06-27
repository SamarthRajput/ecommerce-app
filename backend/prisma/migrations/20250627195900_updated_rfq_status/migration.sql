/*
  Warnings:

  - The values [COMPLETED] on the enum `RFQStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[rfqId,type]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RFQStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "RFQ" ALTER COLUMN "status" TYPE "RFQStatus_new" USING ("status"::text::"RFQStatus_new");
ALTER TYPE "RFQStatus" RENAME TO "RFQStatus_old";
ALTER TYPE "RFQStatus_new" RENAME TO "RFQStatus";
DROP TYPE "RFQStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_rfqId_type_key" ON "ChatRoom"("rfqId", "type");
