-- CreateTable
CREATE TABLE "SellerPacket" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "picklistId" INTEGER NOT NULL,
    "picklistCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Packing',
    "createdBy" INTEGER,

    CONSTRAINT "SellerPacket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerPacketOrder" (
    "id" SERIAL NOT NULL,
    "sellerPacketId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,

    CONSTRAINT "SellerPacketOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerPacket_code_key" ON "SellerPacket"("code");

-- AddForeignKey
ALTER TABLE "SellerPacketOrder" ADD CONSTRAINT "SellerPacketOrder_sellerPacketId_fkey" FOREIGN KEY ("sellerPacketId") REFERENCES "SellerPacket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
