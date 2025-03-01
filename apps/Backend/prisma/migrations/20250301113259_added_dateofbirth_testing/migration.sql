/*
  Warnings:

  - Added the required column `dateofbirth` to the `userProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userProfile" ADD COLUMN     "dateofbirth" TIMESTAMP(3) NOT NULL;
