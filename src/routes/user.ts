import express from 'express';
import userApi from '../controllers/user';

const router = express.Router();

router.get('/', userApi.getAll);
router.get('/:id', userApi.getById);
router.put('/:id', userApi.updateNameById);
router.put('/:id/recover', userApi.recoverById);
router.delete('/:id', userApi.deleteById);

export = router;
