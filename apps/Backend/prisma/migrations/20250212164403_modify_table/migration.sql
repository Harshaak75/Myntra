/*
  Warnings:

  - You are about to drop the column `employeeid` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_employeeid_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "employeeid";
