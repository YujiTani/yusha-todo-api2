/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_uuid_key" ON "Task"("uuid");
