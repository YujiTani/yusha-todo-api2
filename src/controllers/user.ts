import { Request, Response } from 'express';
import logging from '../config/logging';
import connect from '../config/postgresql';

const NAMESPACE = 'User Controller';

const getAll = (req: Request, res: Response) => {
    logging.info(NAMESPACE, `user get route called.`);

    try {
        connect.query(`SELECT * FROM public."user" ORDER BY id ASC`, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.warn(error);
    }
};

const getById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log('id:', id);

    try {
        connect.query(`SELECT * FROM public."user" WHERE id = ${id}`, (error, results) => {
            if (error) {
                throw error;
            }

            if (results.rows.length === 0) {
                res.status(204).send('指定されたデータはありません');
            }

            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.warn(error);
    }
};

const create = (req: Request, res: Response) => {
    const { lastName, firstName, email, password } = req.body;

    try {
        connect.query(
            `INSERT INTO public."user" ("lastName", "firstName", "email", "password") VALUES ($1, $2, $3, $4)`,
            [lastName, firstName, email, password],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send(`新規ユーザーを登録しました。
                登録データ
                性: ${lastName}
                名前: ${firstName}
                メールアドレス: ${email}
                パスワード: ${password}
                `);
            }
        );
    } catch (error) {
        console.warn(error);
    }
};

const updateById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { lastName, firstName } = req.body;

    try {
        connect.query(
            `UPDATE public."user" SET "lastName" = $1, "firstName" = $2 WHERE id = ${id}`,
            [lastName, firstName],
            (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(200).send(`ユーザーID: ${id}の情報を更新しました`);
            }
        );
    } catch (error) {
        console.warn(error);
    }
};

const deleteById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        connect.query(`DELETE FROM public."user" WHERE id = ${id}`, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`ユーザーID: ${id}を削除しました`);
        });
    } catch (error) {
        console.warn(error);
    }
};

export default { getAll, getById, create, updateById, deleteById };
