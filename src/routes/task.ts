import express from 'express';
import taskApi from '../controllers/task';

const router = express.Router();

router.get('/:userId', taskApi.getAllByUserId);
router.get('/:id/user/:userId', taskApi.getById);
router.post('/:userId', taskApi.create);
router.put('/:id', taskApi.updateById);
router.put('/:id/recover', taskApi.recoverById);
router.delete('/:id', taskApi.deleteById);

export = router;
