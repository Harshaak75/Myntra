-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "brand" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "subCategory" VARCHAR(100),
    "price" DECIMAL(65,30) NOT NULL,
    "discount" INTEGER DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sizeOptions" JSONB,
    "colorOptions" JSONB,
    "material" VARCHAR(100),
    "images" TEXT[],
    "rating" DECIMAL(65,30),
    "reviewsCount" INTEGER DEFAULT 0,
    "sellerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "gstNumber" VARCHAR(20),
    "panNumber" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "country" TEXT DEFAULT 'India',
    "bankDetails" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_gstNumber_key" ON "Seller"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_panNumber_key" ON "Seller"("panNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
