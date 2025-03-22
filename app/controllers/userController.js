import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) =>{
    const users = await prisma.user.findMany({
        select: {
            username: true,
            
        }
    });
    return res.status(200).json(users);
}