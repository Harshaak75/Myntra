/*
  Warnings:

  - Made the column `email` on table `Seller` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL;
