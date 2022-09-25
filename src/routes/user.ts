import express from 'express';
import userApi from '../controllers/user';

const router = express.Router();

router.get('/', userApi.getAll);
router.get('/:id', userApi.getById);
router.post('/', userApi.create);
router.put('/:id', userApi.updateById);
router.delete('/:id', userApi.deleteById);

export = router;
