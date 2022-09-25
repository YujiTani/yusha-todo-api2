import { Request, Response } from 'express';
import logging from '../config/logging';
import connect from '../config/postgresql';
import { PrismaClient } from '@prisma/client';

const NAMESPACE = 'Task Controller';
const prisma = new PrismaClient();

const getAll = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task get route called.`);

    try {
        const allTodos = await prisma.task.findMany();
        console.log(allTodos);

        res.status(200).json();
    } catch (error) {
        console.warn(error);
    }
};

const getById = (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task getById  route called.`);
    const id = parseInt(req.params.id);
    console.log('id:', id);

    try {
        connect.query(`SELECT * FROM public."task" WHERE id = ${id}`, (error, results) => {
            if (error) {
                throw error;
            }

            if (results.rows.length === 0) {
                res.status(204).send('指定されたデータはありません');
                return;
            }

            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.warn(error);
    }
};

const create = (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task create route called.`);
    const { name, description } = req.body;

    try {
        connect.query(
            `INSERT INTO public."task" ("name", "description", "created_at", "updated_at") VALUES ($1, $2, $3, $4)`,
            [name, description, new Date(), new Date()],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send(`新規タスクを登録しました。
                登録データ
                タスク名: ${name}
                タスク内容: ${description}
                `);
            }
        );
    } catch (error) {
        console.warn(error);
    }
};

const updateById = (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task updateById route called.`);
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    try {
        connect.query(
            `UPDATE public."task" SET "name" = $1, "description" = $2, "updated_at" = $3 WHERE id = ${id}`,
            [name, description, new Date()],
            (error, results) => {
                if (error) {
                    throw error;
                }

                console.log('results:', results);

                if (results.rows.length === 0) {
                    return res.status(204).json(results.rows);
                }

                res.status(200).send(`タスクID: ${id}の情報を更新しました`);
            }
        );
    } catch (error) {
        console.warn(error);
    }
};

const deleteById = (req: Request, res: Response) => {
    logging.info(NAMESPACE, `task deleteById route called.`);
    const id = parseInt(req.params.id);

    try {
        connect.query(`DELETE FROM public."task" WHERE id = ${id}`, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`タスクID: ${id}を削除しました`);
        });
    } catch (error) {
        console.warn(error);
    }
};

export default { getAll, getById, create, updateById, deleteById };
