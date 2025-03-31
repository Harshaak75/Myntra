/*
  Warnings:

  - You are about to drop the column `name` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "name",
ADD COLUMN     "firstname" VARCHAR(255) NOT NULL,
ADD COLUMN     "lastname" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
