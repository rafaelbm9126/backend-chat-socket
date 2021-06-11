const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const Socket = require("./socket");
const DataBChat = require("./database");
const FunctChat = require("./functions");

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const functChat = new FunctChat(new DataBChat());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/pages/index.css");
});

app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/pages/index.js");
});

io.on("connection", Socket(io, functChat));

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
