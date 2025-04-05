import { Server } from "socket.io";
import { addUser, removeUser, getUserSocket, getOnlineUsers } from "../utils/onlineUsers.js";
import { saveMessage } from "../services/chatService.js";

export const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("یک کاربر متصل شد:", socket.id);

    // وقتی کاربر آنلاین شد
    socket.on("userOnline", (userId) => {
      addUser(userId, socket.id);
      io.emit("updateUserList", getOnlineUsers());
    });

    // ارسال پیام
    socket.on("sendMessage", async ({ senderId, senderName, receiverId, content }) => {
      const savedMessage = await saveMessage(senderId, receiverId, content);
      const receiverSocket = getUserSocket(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", { senderId, senderName, content });
      }
    });

    // وقتی کاربر آفلاین شد
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("updateUserList", getOnlineUsers());
    });
  });
};