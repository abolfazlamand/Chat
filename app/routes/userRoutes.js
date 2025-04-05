import express from 'express';
import { 
    signIn,
    signUp,
    signOut,
    getUsers,
 } from '../controllers/userController.js';

import { privateRoute } from "../middleware/privateRoute.js"  

const router = express.Router();


router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);


router.get('/getUsers', privateRoute, getUsers);

export default router;