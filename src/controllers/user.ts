import { Request, Response } from 'express';
import logging from '../config/logging';
import { PrismaClient } from '@prisma/client';
import UUID from 'uuidjs';

const NAMESPACE = 'User Controller';
const prisma = new PrismaClient();

// 全ユーザーを取得
const getAll = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user get route called.`);

    try {
        const allUser = await prisma.user.findMany({
            where: { deleted_flg: false },
            include: { stutas: true }
        });

        if (allUser.length === 0) {
            res.status(404).send({
                message: 'データがありません。'
            });
        }

        res.status(200).json({
            message: '全ユーザーを取得しました',
            allUser
        });
    } catch (error) {
        console.warn(error);
    }
};

// 指定ユーザーIDに一致するユーザーを取得
const getById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user getById route called.`);
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: userId
            },
            include: { stutas: true }
        });

        if (!user) {
            res.status(404).send({
                message: 'お探しのユーザーが登録されておりません。'
            });
        }

        res.status(200).json({
            message: '指定ユーザーを取得しました。',
            user
        });
    } catch (error) {
        console.warn(error);
    }
};

// 新規ユーザーを登録
const create = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user create route called.`);
    const { email, name, password } = req.body;

    try {
        const ID: string = UUID.generate();
        const newUser = await prisma.user.create({
            data: {
                uuid: ID,
                email,
                name,
                password,
                created_at: new Date(),
                deleted_flg: false,
                update_at: new Date()
            }
        });

        const newStutas = await prisma.stutas.create({
            data: {
                userId: newUser.uuid
            }
        });

        res.status(200).send({
            message: '新規ユーザーを登録しました。',
            newUser,
            newStutas
        });
    } catch (error) {
        console.warn(error);
    }
};

// 指定ユーザーを更新
const updateNameById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user updateNameById route called.`);
    const userId = req.params.id;
    const { email, name } = req.body;

    try {
        const updateUser = await prisma.user.update({
            where: {
                uuid: userId
            },
            data: {
                email,
                name,
                update_at: new Date()
            }
        });

        res.status(200).send({
            message: `ユーザーID: ${userId}を更新しました。`,
            updateUser
        });
    } catch (error) {
        console.warn(error);
    }
};

/* 指定ユーザーを復元 */
const recoverById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user recoverById route called.`);
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: userId
            }
        });

        if (user?.deleted_flg) {
            const recoverUser = await prisma.user.update({
                where: {
                    uuid: userId
                },
                data: {
                    deleted_flg: false
                }
            });
            res.status(200).send({
                message: `ユーザーID: ${userId}を復元しました。`,
                recoverUser
            });
        }

        res.status(404).send({
            message: '削除ユーザーの中に見つかりません。'
        });
    } catch (error) {
        console.warn(error);
    }
};

// 指定ユーザーを削除
const deleteById = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user deleteById route called.`);
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: userId
            }
        });

        if (user?.deleted_flg) {
            const deleteUser = await prisma.user.delete({
                where: {
                    uuid: userId
                }
            });

            res.status(200).send({
                message: `ユーザーID: ${userId}を完全に削除しました。`,
                deleteUser
            });
        }
        const removeUser = await prisma.user.update({
            where: {
                uuid: userId
            },
            data: {
                deleted_flg: true
            }
        });

        res.status(200).send({
            message: `ユーザーID: ${userId}を論理削除しました。`,
            removeUser
        });
    } catch (error) {
        console.warn(error);
    }
};

export default { getAll, getById, create, updateNameById, recoverById, deleteById };
