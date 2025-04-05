import express from 'express';
import {
    sendMessage,
    getMessages,
} from '../controllers/messageController.js';
import { privateRoute } from '../middleware/privateRoute.js';

const router = express.Router();

router.post('/send/:receiverId', privateRoute, sendMessage);
router.get('/:receiverId', privateRoute, getMessages);

export default router;