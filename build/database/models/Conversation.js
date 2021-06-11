"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = void 0;
var mongoose_1 = require("mongoose");
var ConversationSchema = function () {
    return new mongoose_1.Schema({
        a: String,
        b: String,
    });
};
exports.ConversationSchema = ConversationSchema;
