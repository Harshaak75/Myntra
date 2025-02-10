-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "employeeid" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeid_key" ON "users"("employeeid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
