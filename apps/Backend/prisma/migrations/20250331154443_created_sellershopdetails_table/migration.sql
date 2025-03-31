-- CreateTable
CREATE TABLE "SellerShopDetails" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "shopName" VARCHAR(255) NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "pincode" VARCHAR(15) NOT NULL,
    "city" VARCHAR(20) NOT NULL,
    "category" TEXT[],
    "gstnumber" VARCHAR(30) NOT NULL,
    "pannumber" VARCHAR(15) NOT NULL,

    CONSTRAINT "SellerShopDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SellerShopDetails" ADD CONSTRAINT "SellerShopDetails_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
