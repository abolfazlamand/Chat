import express from 'express';
import { register } from '../controllers/authController.js';
import { validateRegister, checkDuplicateUsername } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',validateRegister,checkDuplicateUsername, register);

export default router;