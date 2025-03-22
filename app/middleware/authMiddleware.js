import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


export const checkDuplicateUsername = async (req, res, next) => {
    const { username } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists'});
    }
    next();
}


export const validateRegister = (req, res, next) => {
    const { firstname, lastname, username, email, password } = req.body;
    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required'});
    }
    next();
}

export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required'});
    }
    next();
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}