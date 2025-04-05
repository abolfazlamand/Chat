import { PrismaClient } from "@prisma/client";
import { getReceiverSocketId, io } from '../socket/socket.js';
import { createConversation, createUserConversation, findConversationId } from './conversation.js';

const prisma = new PrismaClient();

export const sendMessageService = async (body) => {
    const { senderId, receiverId } = body;

    if (!senderId || !receiverId) {
        throw new Error('Both senderId and receiverId must be provided.');
    }

    let conversationId;

    const findConversation = await findConversationId(senderId, receiverId);
    if (findConversation) {
        conversationId = findConversation;
    } else {
        const conversation = await createConversation('new conversation');
        conversationId = conversation?.id;

        await createUserConversation(conversationId, [senderId, receiverId]);
    }

    const newMessage = await prisma.message.create({
        data: {
            ...body,
            conversationId,
        },
    });

    if (newMessage) {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.emit("notification", newMessage);
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return newMessage[0];

    } else {
        throw new Error('Mess;lage not sent');
    }
};


export const getMessagesService = async (senderId, receiverId) => {
    const findConversation = await findConversationId(senderId, receiverId);
    const messages = await prisma.message.findMany({
        where: { conversationId: findConversation },
        orderBy: { createdAt: 'asc' },
    })
    return messages
}
