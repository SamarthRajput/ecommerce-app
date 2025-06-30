-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "deliveryTimeInDays" INTEGER,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "licenses" TEXT[],
ADD COLUMN     "logisticsSupport" TEXT,
ADD COLUMN     "minimumOrderQuantity" INTEGER,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "warrantyPeriod" TEXT;
