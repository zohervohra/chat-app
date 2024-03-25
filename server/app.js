import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";


const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ roomName, message  , username }) => {
    console.log({ roomName, message , username });
    socket.to(roomName).emit("receive-message", {message , username});
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`User  joined room ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
