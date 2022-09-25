-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "state" INTEGER NOT NULL DEFAULT 1,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_flg" BOOLEAN NOT NULL DEFAULT false,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patyId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stutas" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lv" INTEGER NOT NULL DEFAULT 1,
    "total_exp" BIGINT NOT NULL DEFAULT 0,
    "strength" INTEGER NOT NULL DEFAULT 3,
    "intelligence" INTEGER NOT NULL DEFAULT 3,
    "creativity" INTEGER NOT NULL DEFAULT 3,
    "activity" INTEGER NOT NULL DEFAULT 3,
    "quality_of_life" INTEGER NOT NULL DEFAULT 3,
    "deleted_flg" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Stutas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paty" (
    "id" SERIAL NOT NULL,
    "uuid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_flg" BOOLEAN NOT NULL DEFAULT false,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "uuid" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "state" INTEGER NOT NULL DEFAULT 1,
    "isHistory" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_flg" BOOLEAN NOT NULL DEFAULT false,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTask" (
    "id" SERIAL NOT NULL,
    "uuid" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "state" INTEGER NOT NULL DEFAULT 1,
    "isHistory" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_flg" BOOLEAN NOT NULL DEFAULT false,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stutas_userId_key" ON "Stutas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Paty_uuid_key" ON "Paty"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Task_userId_key" ON "Task"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubTask_userId_key" ON "SubTask"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubTask_parentId_key" ON "SubTask"("parentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_patyId_fkey" FOREIGN KEY ("patyId") REFERENCES "Paty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stutas" ADD CONSTRAINT "Stutas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
