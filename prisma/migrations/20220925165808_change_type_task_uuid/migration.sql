-- AlterTable
ALTER TABLE "SubTask" ALTER COLUMN "parentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "uuid" SET DATA TYPE TEXT;