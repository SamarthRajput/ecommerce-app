/*
  Warnings:

  - Added the required column `cityOfDispatch` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTerm` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryTerm" AS ENUM ('EXW', 'FOR', 'FOB', 'CIF');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cityOfDispatch" TEXT NOT NULL,
ADD COLUMN     "deliveryTerm" "DeliveryTerm" NOT NULL,
ADD COLUMN     "loadCountry" TEXT,
ADD COLUMN     "loadPort" TEXT,
ADD COLUMN     "packingDescription" TEXT,
ADD COLUMN     "primaryPacking" TEXT,
ADD COLUMN     "secondaryPacking" TEXT;
