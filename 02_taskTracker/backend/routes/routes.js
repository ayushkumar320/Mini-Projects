import {Router} from 'express';
import {
  registerUser,
  loginUser,
  addTask,
  maskAsComplete,
  editTask,
  deleteTask,
  getTasks
} from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/tasks', authMiddleware, addTask);
router.patch('/tasks/:id/complete', authMiddleware, maskAsComplete);
router.put('/tasks/:id', authMiddleware, editTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);
router.get('/tasks', authMiddleware, getTasks);

export default router;