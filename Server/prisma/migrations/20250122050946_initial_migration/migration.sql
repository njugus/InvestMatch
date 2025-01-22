-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Investor', 'Startup', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "UserID" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "LastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
