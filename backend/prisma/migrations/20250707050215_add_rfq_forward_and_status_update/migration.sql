-- AlterEnum
ALTER TYPE "RFQStatus" ADD VALUE 'FORWARDED';

-- CreateTable
CREATE TABLE "RFQForward" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "isUpdatedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "forwardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RFQForward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RFQForward_rfqId_sellerId_key" ON "RFQForward"("rfqId", "sellerId");

-- AddForeignKey
ALTER TABLE "RFQForward" ADD CONSTRAINT "RFQForward_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQForward" ADD CONSTRAINT "RFQForward_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
