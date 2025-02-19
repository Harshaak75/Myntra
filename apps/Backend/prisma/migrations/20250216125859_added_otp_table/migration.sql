-- CreateTable
CREATE TABLE "otpTable" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT,
    "expiresAt" TIMESTAMP(3),
    "lastRequestAt" TIMESTAMP(3),

    CONSTRAINT "otpTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otpTable_email_key" ON "otpTable"("email");
