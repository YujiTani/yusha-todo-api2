/*
  Warnings:

  - You are about to alter the column `total_exp` on the `Stutas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Stutas" ALTER COLUMN "total_exp" SET DATA TYPE INTEGER;
