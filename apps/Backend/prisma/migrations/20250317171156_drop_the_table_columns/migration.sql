/*
  Warnings:

  - You are about to drop the column `approved` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `colorOptions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sizeOptions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "approved",
DROP COLUMN "brand",
DROP COLUMN "category",
DROP COLUMN "colorOptions",
DROP COLUMN "description",
DROP COLUMN "discount",
DROP COLUMN "images",
DROP COLUMN "material",
DROP COLUMN "rating",
DROP COLUMN "reviewsCount",
DROP COLUMN "sizeOptions",
DROP COLUMN "stock",
DROP COLUMN "subCategory";
