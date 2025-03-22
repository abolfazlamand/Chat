import express from 'express';
import * as auth from '../middleware/authMiddleware.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/getUsers', auth.authenticateToken, getUsers);

export default router;