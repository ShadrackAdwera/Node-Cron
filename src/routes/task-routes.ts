import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import express from 'express';

import { getTasks, createTask, updateTaskStatus } from '../controllers/task-controllers';

const router = express.Router();

router.use(checkAuth);
router.get('/', getTasks);

router.post('/new', [
    body('title').trim().isLength({ min: 6 })
], createTask);

router.patch('/:taskId', updateTaskStatus);

export { router as tasksRouter };