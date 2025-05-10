/*
  Warnings:

  - You are about to drop the column `Locality` on the `userAddress` table. All the data in the column will be lost.
  - Added the required column `locality` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `userAddress` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `userAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `userAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `userAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pincode` on table `userAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `typeOfAddress` on table `userAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "userAddress" DROP COLUMN "Locality",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "pincode" SET NOT NULL,
ALTER COLUMN "typeOfAddress" SET NOT NULL;
