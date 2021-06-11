import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// io.on("connection", Socket(io, functChat));

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
