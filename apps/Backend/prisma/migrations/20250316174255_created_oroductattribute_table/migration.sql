-- CreateTable
CREATE TABLE "productAttribute" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "attributename" TEXT NOT NULL,
    "attributevalue" TEXT NOT NULL,

    CONSTRAINT "productAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productAttribute" ADD CONSTRAINT "productAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
