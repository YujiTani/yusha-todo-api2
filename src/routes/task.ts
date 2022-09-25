import express from 'express';
import taskApi from '../controllers/task';

const router = express.Router();

router.get('/', taskApi.getAll);
router.get('/:id', taskApi.getById);
router.post('/', taskApi.create);
router.put('/:id', taskApi.updateById);
router.delete('/:id', taskApi.deleteById);

export = router;
