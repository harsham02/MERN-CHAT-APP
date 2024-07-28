const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewear/errorMiddlewear');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://mern-chat-app-eight-tau.vercel.app"
}));

app.get('/', (req, res) => {
  res.send("Hello world brocode");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.once("setup", (userData) => {
    console.log("Setup event received:");
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    console.log("Join chat event received:", room);
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => {
    console.log("Typing event received:", room);
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    console.log("Stop typing event received:", room);
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    console.log("New message event received:", newMessageReceived);
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
