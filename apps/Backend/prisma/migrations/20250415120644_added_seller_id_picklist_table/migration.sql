/*
  Warnings:

  - Added the required column `sellerId` to the `Picklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Picklist" ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Picklist" ADD CONSTRAINT "Picklist_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
