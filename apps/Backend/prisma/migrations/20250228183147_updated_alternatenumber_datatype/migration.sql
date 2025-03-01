/*
  Warnings:

  - You are about to drop the column `AlternateNumberName` on the `userProfile` table. All the data in the column will be lost.
  - You are about to drop the column `Alternatenumber` on the `userProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userProfile" DROP COLUMN "AlternateNumberName",
DROP COLUMN "Alternatenumber",
ADD COLUMN     "alternateNumber" TEXT,
ADD COLUMN     "alternateNumberName" TEXT;
