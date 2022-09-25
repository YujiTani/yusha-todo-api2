import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import userRoutes from './routes/user';
import taskRoutes from './routes/task';

const NAMESPACE = 'Server';
const app = express();

app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });

    next();
});

/** Parse the Request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'Get PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
app.use('/user', userRoutes);
app.use('/task', taskRoutes);

/** Error  Handling */
app.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });

    next();
});

/** create the server*/
const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () =>
    logging.info(NAMESPACE, `Server running on http://${config.server.hostname}:${config.server.port}`)
);
