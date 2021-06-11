"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
var mongoose_1 = require("mongoose");
var MessageSchema = function () {
    return new mongoose_1.Schema({
        usid: String,
        rmid: String,
        group: Boolean,
        to: String,
        parley: String,
        msg: String,
        read: [String],
    });
};
exports.MessageSchema = MessageSchema;
