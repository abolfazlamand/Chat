import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken , generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

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

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { username }
        });
    
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            return res.status(200).json({ accessToken, refreshToken });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    };

export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }
    try {
        const user = verifyRefreshToken(token);
        const newaccessToken = generateAccessToken(user);
        const newefreshToken = generateRefreshToken(user);
        return res.status(200).json({ accessToken: newaccessToken, refreshToken: newefreshToken });
    }catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}   