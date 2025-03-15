-- CreateTable
CREATE TABLE "SellerDocuments" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerDocuments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SellerDocuments" ADD CONSTRAINT "SellerDocuments_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
