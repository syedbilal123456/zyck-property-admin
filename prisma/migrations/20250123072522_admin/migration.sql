/*
  Warnings:

  - You are about to drop the column `city` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `landmark` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `PropertyLocation` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `PropertyLocation` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `PropertyLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateId` to the `PropertyLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyTypeId` to the `PropertyTypeDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdminId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PropertyLocation" DROP COLUMN "city",
DROP COLUMN "landmark",
DROP COLUMN "region",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "stateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PropertyTypeDetail" ADD COLUMN     "propertyTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "AdminId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_AdminId_fkey" FOREIGN KEY ("AdminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLocation" ADD CONSTRAINT "PropertyLocation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLocation" ADD CONSTRAINT "PropertyLocation_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTypeDetail" ADD CONSTRAINT "PropertyTypeDetail_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
