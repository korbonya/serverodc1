import express from 'express';
import { getUsers, createUser, getUser, deleteUser, updateUser, register, login } from '../controllers/users.js';
import { protect } from '../middlewares/protect.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/',protect, createUser);
router.get('/:id',protect, getUser);
router.delete('/:id',protect, deleteUser);
router.patch('/:id', updateUser);
router.post('/register', register);
router.post('/login', login);


export default router;
