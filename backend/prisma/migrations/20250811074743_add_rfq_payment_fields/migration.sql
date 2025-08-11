-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TELEGRAPHIC_TRANSFER', 'LETTER_OF_CREDIT');

-- AlterTable
ALTER TABLE "RFQ" ADD COLUMN     "advancePaymentPercentage" DOUBLE PRECISION,
ADD COLUMN     "cashAgainstDocumentsPercentage" DOUBLE PRECISION,
ADD COLUMN     "documentsAgainstAcceptancePercentage" DOUBLE PRECISION,
ADD COLUMN     "documentsAgainstPaymentPercentage" DOUBLE PRECISION,
ADD COLUMN     "letterOfCreditDescription" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "requestChangeInDeliveryTerms" BOOLEAN,
ADD COLUMN     "servicesRequired" TEXT[],
ADD COLUMN     "unit" TEXT;
