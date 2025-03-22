import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import * as auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',auth.validateRegister,auth.checkDuplicateUsername, register);
router.post('/login', auth.validateLogin, login);
router.post('/refreshToken', refreshToken);

export default router;