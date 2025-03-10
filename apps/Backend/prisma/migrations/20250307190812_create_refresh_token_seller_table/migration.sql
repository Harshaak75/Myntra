-- CreateTable
CREATE TABLE "refresh_token_seller" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_token_seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_seller_sellerId_key" ON "refresh_token_seller"("sellerId");

-- AddForeignKey
ALTER TABLE "refresh_token_seller" ADD CONSTRAINT "refresh_token_seller_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
