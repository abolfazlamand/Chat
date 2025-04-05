import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createConversation = async (title) => {
    const newconversation = await prisma.conversation.create({
        data: { title },
    });
    return newconversation;
};

export const createUserConversation = async (conversationId, userIds) => {
    // Log userIds to make sure they are correct
    console.log('User IDs:', userIds);

    // Filter out any undefined userId before creating the records
    const validUserIds = userIds.filter(userId => userId !== undefined && userId !== null);

    // If there are invalid userIds, log an error and return
    if (validUserIds.length !== userIds.length) {
        console.error('Some user IDs are invalid:', userIds);
        return; // Handle this situation, maybe throw an error or return early
    }

    // Proceed with creating the user conversations
    const userConversations = await prisma.userConversation.createMany({
        data: validUserIds.map(userId => ({
            userId,
            conversationId
        })),
        skipDuplicates: true
    });

    return userConversations;
};

export const findConversationId = async (senderId, receiverId) => {
    // Find a conversation where both senderId and receiverId exist
    const conversation = await prisma.conversation.findFirst({
        where: {
            users: {
                every: {
                    OR: [
                        { userId: senderId },
                        { userId: receiverId }
                    ]
                }
            }
        },
        select: {
            id: true
        },
    });

    // Return the conversation ID if found
    return conversation ? conversation.id : null;
};
