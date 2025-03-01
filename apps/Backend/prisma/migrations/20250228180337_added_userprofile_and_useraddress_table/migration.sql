-- CreateTable
CREATE TABLE "userProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "Gender" TEXT NOT NULL,
    "dateofbirth" TIMESTAMP(3) NOT NULL,
    "Alternatenumber" INTEGER,
    "AlternateNumberName" TEXT,

    CONSTRAINT "userProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAddress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "Locality" TEXT,
    "typeOfAddress" TEXT DEFAULT 'home',

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userProfile_userId_key" ON "userProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userAddress_userId_key" ON "userAddress"("userId");

-- AddForeignKey
ALTER TABLE "userProfile" ADD CONSTRAINT "userProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
