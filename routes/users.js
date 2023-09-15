import express from 'express';
import { getUsers, createUser, getUser, deleteUser, updateUser, register, login } from '../controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);
router.post('/register', register);
router.post('/login', login);


export default router;
