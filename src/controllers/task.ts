import { Request, Response } from 'express';
import logging from '../config/logging';
import { PrismaClient } from '@prisma/client';
import UUID from 'uuidjs';
import { SERVER_HOSTNAME, SERVER_PORT } from '../config/config';

const NAMESPACE = 'Task Controller';
const prisma = new PrismaClient();

// 指定ユーザーの全タスクを取得
const getAllByUserId = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task getAllByUserId route called.`);
    const userId = req.params.userId;

    try {
        const allTask = await prisma.task.findMany({
            where: {
                userId,
                deleted_flg: false
            },
            include: { user: true }
        });

        if (allTask.length === 0) {
            res.status(200).send('登録されたタスクはありません。');
        }

        res.status(200).json(allTask);
    } catch (error) {
        console.warn(error);
    }
};

// 指定ユーザーの指定タスクを取得
// 指定task.uuidに一致するタスクを取得
// Memo: URLにuserIdを含んだ方がいいかもしれない
const getById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task getById  route called.`);
    const taskId = req.params.id;

    try {
        const task = await prisma.task.findUnique({
            where: {
                uuid: taskId
            },
            include: { user: true }
        });

        if (!task) {
            res.status(404).send('お探しのタスクは登録されておりません。');
        }

        res.status(200).json(task);
    } catch (error) {
        console.warn(error);
    }
};

// 指定ユーザーの新規タスクを登録
const create = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task create route called.`);
    const userId = req.params.userId;
    const { name, description, priority, limited_at } = req.body;

    try {
        const ID: string = UUID.generate();
        const newTask = await prisma.task.create({
            data: {
                uuid: ID,
                userId,
                name,
                description,
                priority,
                created_at: new Date(),
                limited_at,
                deleted_flg: false,
                update_at: new Date()
            }
        });

        res.header('Location', `${SERVER_HOSTNAME}:${SERVER_PORT}/task/${newTask.uuid}/user/${userId}`);
        res.status(201).send({ message: '新規タスクを登録しました', newTask });
    } catch (error) {
        console.warn(error);
    }
};

// 指定タスクを更新
const updateById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task updateById route called.`);
    const id = req.params.id;
    const { name, description, priority, limited_at } = req.body;

    try {
        const updateTask = await prisma.task.update({
            where: {
                uuid: id
            },
            data: {
                name,
                description,
                priority,
                limited_at,
                update_at: new Date()
            }
        });

        res.status(200).send({
            message: 'タスクの更新を行いました',
            updateTask
        });
    } catch (error) {
        console.warn(error);
    }
};

/* 指定タスクを復元 */
const recoverById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task recoverById route called.`);
    const taskId = req.params.id;

    try {
        const task = await prisma.task.findUnique({
            where: {
                uuid: taskId
            }
        });

        if (task?.deleted_flg) {
            const recoverTask = await prisma.task.update({
                where: {
                    uuid: taskId
                },
                data: {
                    deleted_flg: false
                }
            });
            res.status(200).send({
                message: `タスクID: ${taskId}を復元しました。`,
                recoverTask
            });
        }

        res.status(404).send({
            message: '削除タスクの中に見つかりません。'
        });
    } catch (error) {
        console.warn(error);
    }
};

// 指定タスクを削除
const deleteById = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        const task = await prisma.task.findUnique({
            where: {
                uuid: taskId
            }
        });

        if (task?.deleted_flg) {
            logging.info(NAMESPACE, `task deleteById route called.`);
            await prisma.task.delete({
                where: {
                    uuid: taskId
                }
            });

            res.status(200).send(`タスクID: ${taskId}を完全削除しました。`);
        }
        logging.info(NAMESPACE, `task removeById route called.`);
        await prisma.task.update({
            where: {
                uuid: taskId
            },
            data: {
                deleted_flg: true
            }
        });

        res.status(200).send(`タスクID: ${taskId}を論理削除しました。`);
    } catch (error) {
        console.warn(error);
    }
};

export default { getAllByUserId, getById, create, updateById, recoverById, deleteById };
