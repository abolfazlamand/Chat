import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const onlineUsers= new Map(); 

export const getReceiverSocketId = (receiverId) => {
    return onlineUsers.get(receiverId)
};


io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    const userId= socket.handshake.query.userId;

    if(userId) {
        onlineUsers.set(userId, socket.id);
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("disconnect", ()=>{
        console.log("a user disconnectes", socket.id);
        onlineUsers.delete(userId);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });

    console.log(Array.from(onlineUsers.entries()));
});

export { app, io, server}