import express from "express";
import {
    sendMessageService,
    getMessagesService,
    
} from '../services/message.js';

export const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { receiverId } = req.body;
        const senderId = req.user.id;

        const messageData = { content, receiverId, senderId };

        const newMessage = await sendMessageService(messageData);

        return res.status(200).json(newMessage)

    } catch (e) {
        console.log(e);
        return res.status(500).send(e)

    }
}

export const getMessages = async (req, res) => {
    try { 
    const {receiverId}= req.params;
    const senderId = req.user.id;

    const messages = await getMessagesService(senderId,receiverId);
    return res.status(200).json(messages);
    }catch(e){
        console.log(e);
        return res.status(500).send(e)
    }


}