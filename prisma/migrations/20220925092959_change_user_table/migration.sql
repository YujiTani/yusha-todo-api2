-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_patyId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "patyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_patyId_fkey" FOREIGN KEY ("patyId") REFERENCES "Paty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
