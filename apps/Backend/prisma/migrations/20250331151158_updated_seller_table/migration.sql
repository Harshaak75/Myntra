/*
  Warnings:

  - You are about to drop the column `address` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "address",
ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT;
