import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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