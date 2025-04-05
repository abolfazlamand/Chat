import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const saveMessage = async (senderId, receiverId, content) => {
  return await prisma.message.create({
    data: { senderId, receiverId, content },
  });
};

export const getMessages = async (userId1, userId2) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
};