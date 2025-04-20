/*
  Warnings:

  - A unique constraint covering the columns `[productSku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sellerSku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productSku" TEXT,
ADD COLUMN     "sellerSku" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_productSku_key" ON "Product"("productSku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sellerSku_key" ON "Product"("sellerSku");
