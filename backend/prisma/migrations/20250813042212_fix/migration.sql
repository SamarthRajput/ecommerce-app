/*
  Warnings:

  - A unique constraint covering the columns `[productId,sellerId,type]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Made the column `productId` on table `ChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_productId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "productId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_productId_sellerId_type_key" ON "ChatRoom"("productId", "sellerId", "type");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
