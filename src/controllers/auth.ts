import { Request, Response } from 'express';
import logging from '../config/logging';
import { PrismaClient } from '@prisma/client';
import UUID from 'uuidjs';
import { SERVER_HOSTNAME, SERVER_PORT } from '../config/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const NAMESPACE = 'Auth Controller';
const prisma = new PrismaClient();
const saltRounds = 10;

// 新規ユーザーを登録
const create = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user create route called.`);
    const { email, name, password } = req.body;
    const hassedPassword = bcrypt.hashSync(password, saltRounds);

    try {
        const ID: string = UUID.generate();
        const newUser = await prisma.user.create({
            data: {
                uuid: ID,
                email,
                name,
                password: hassedPassword,
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
        res.header('Location', `http://${SERVER_HOSTNAME}:${SERVER_PORT}/user/${newUser.uuid}`);
        res.status(201).send({
            message: '新規ユーザーを登録しました。',
            newUser,
            newStutas
        });
    } catch (error) {
        console.warn(error);
    }
};

// ログイン
const login = async (req: Request, res: Response) => {
    logging.info(NAMESPACE, `auth login route called.`);
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        res.status(404).send({
            message: '登録されていないemailアドレスです'
        });
    }

    if (user === null) {
        res.status(404).send({
            message: '登録されていないemailアドレスです'
        });
        return;
    }

    bcrypt.compare(password, user.password, (error, results) => {
        if (error) {
            res.status(400).json({
                message: error.message
            });
        }

        if (!results) {
            res.status(404).send({
                message: '登録されていないpasswordです'
            });
        }

        const payload = {
            id: user.uuid,
            name: user.name,
            email: user.email
        };

        const token = jwt.sign(payload, 'secret');
        var today = new Date();

        res.status(201).send({
            message: '認証成功',
            token,
            expiresAt: today.setDate(today.getDate() + 7)
        });
    });
};

export default { create, login };
