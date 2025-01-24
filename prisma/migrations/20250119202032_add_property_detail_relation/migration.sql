/*
  Warnings:

  - Added the required column `DetailId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "DetailId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PropertyTypeDetail" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PropertyTypeDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_DetailId_fkey" FOREIGN KEY ("DetailId") REFERENCES "PropertyTypeDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
