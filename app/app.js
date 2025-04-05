import express from 'express';
import cookieParser from 'cookie-parser';
// import http from 'http';
// import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js'; 
import { app, server } from "./socket/socket.js"


dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const app = express();
app.use(cookieParser());

// const server = http.createServer(app);
// setupSocketServer(server);



app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/users', userRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});