import { PrismaClient } from "@prisma/client";

import {
    signUpService,
    signInService,
    signOutService,
    getUsersService,
} from '../services/user.js'

// const prisma = new PrismaClient();
// 
// export const getUsers = async (req, res) =>{
//     const users = await prisma.user.findMany({
//         select: {
//             username: true,

//         }
//     });
//     return res.status(200).json(users);
// }

export const signUp = async (req, res) => {
    try {
        const user = await signUpService(req.body, res);
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message)
    }
}

export const signIn = async (req, res) => {
    try {
        const user = await signInService(req.body, res);
        return res.status(200).json(user)
    } catch (e) {
        console.log(e);
        return res.status(401).send('Something went wrong')
    }
}

export const signOut = async (req, res) => {
    try {
        signOutService(res);
        return res.status(200).json({ message: 'logout successfully' });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e)
    }
}

export const getUsers = async(req,res) =>{
    try{
        const senderId= req.user.id;
        const users= await getUsersService(senderId)
        return res.status(200).json(users)
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
}