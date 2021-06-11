"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
require("dotenv").config();
var PORT = process.env.PORT || 8080;
var app = express_1.default();
var server = http_1.createServer(app);
var io = new socket_io_1.Server(server);
app.use(express_1.default.static('public'));
// io.on("connection", Socket(io, functChat));
server.listen(PORT, function () {
    console.log("listening on *:" + PORT);
});
