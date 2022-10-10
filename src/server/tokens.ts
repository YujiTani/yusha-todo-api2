import jwt from 'jsonwebtoken';

export const verify = async (bearToken: string) => {
    const bearer = bearToken.split(' ');
    const token = bearer[1];

    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret', (error, response) => {
            if (error === null) {
                resolve(response);
            } else {
                reject(error);
            }
        });
    });
};
