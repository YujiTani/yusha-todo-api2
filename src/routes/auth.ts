import express from 'express';
import authApi from '../controllers/auth';

const router = express.Router();

router.post('/register', authApi.create);
router.post('/login', authApi.login);

export = router;
