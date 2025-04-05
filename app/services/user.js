import { PrismaClient } from "@prisma/client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import bcryptjs from 'bcrypt';
import { setCookie, omitFields } from '../utils/utils.js';


const prisma = new PrismaClient();

export const findUserById = async (id) => {
    const findUser = await prisma.user.findUnique({
        where: {
            id: id,
        }
    });
    return findUser;
}

export const signUpService = async (body, res) => {
    const { firstName, lastName, username, email, password } = body


    const existingUser = await prisma.user.findUnique({
        where: { username }
    })
    if (existingUser) {
        throw new Error('user already exists')
    }

    const avatar = 'https://www.example.com/default-avatar.png';
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUserData = { ...body, password };

    const newUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            avatar

        },
    });
    if (newUser) {
        setCookie(newUser.id, res);
        const userWithoutPassword = omitFields(newUser, ['password']);
        return userWithoutPassword;
    } else {
        throw new Error("USER CREATION FAILED");
    }
};

export const signInService = async (body, res) => {
    const { username, password } = body;
    const findUser = await prisma.user.findUnique({
        where: { username }
    });

    if (!findUser) throw new Error("401");

    const validPassword = await bcryptjs.compare(password, findUser.password);

    if (!validPassword) throw new Error("401");

    setCookie(findUser.id, res);
    const findUserWithoutPassword = omitFields(findUser, ['password']);
    return findUserWithoutPassword;
}

export const signOutService = async (res) => {
    res.cookie("token", "", { maxAge: 0 });
    return true
}

export const getUsersService = async (senderId) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                not: senderId,
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,

        },
    });
    return users;

}