import { Request, Response } from 'express';
import logging from '../config/logging';
import { PrismaClient } from '@prisma/client';
import UUID from 'uuidjs';
import { SERVER_HOSTNAME, SERVER_PORT } from '../config/config';
import bcrypt from 'bcrypt';
import { verify } from '../server/tokens';

const NAMESPACE = 'User Controller';
const prisma = new PrismaClient();
const saltRounds = 10;

// 全ユーザーを取得
const getAll = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user get route called.`);

    try {
        if (req.headers['authorization'] === undefined) {
            return res.status(401).json({
                message: '認証失敗'
            });
        }

        const verifyResponse = await verify(req.headers['authorization']);
        if (verifyResponse === 'invalid token') {
            return res.status(401).json({
                message: '認証失敗'
            });
        }

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
