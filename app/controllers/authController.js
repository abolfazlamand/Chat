import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken , generateRefreshToken } from '../utils/jwt.js'

const prisma = new PrismaClient();

export const register = async (req, res) =>{
    const { firstname, lastname, username, email, password } = req.body;

    

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                username,
                email,
                password: hashedPassword
            },
        });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ error: 'User registration failed'});
    }
    
};