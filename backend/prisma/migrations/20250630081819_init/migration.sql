-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "companyBio" TEXT,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keyProducts" TEXT[],
ADD COLUMN     "otherDocsUrl" TEXT,
ADD COLUMN     "panOrTin" TEXT;
