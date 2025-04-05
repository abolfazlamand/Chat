import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const onlineUsers= {} ;

export const getReceiverSocketId = (receiverId) => {
    return onlineUsers[receiverId]
};


io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    const userId= socket.handshake.query.userId;

    if(userId) {
        onlineUsers[userId] =socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    socket.on("disconnect", ()=>{
        console.log("a user disconnectes", socket.id);
        delete onlineUsers[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });

    console.log(onlineUsers);
});

export { app, io, server}