"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAndRoomShema = void 0;
var mongoose_1 = require("mongoose");
var UserAndRoomShema = function () {
    return new mongoose_1.Schema({
        usid: { type: String, required: true },
        rmid: { type: String, required: true },
    });
};
exports.UserAndRoomShema = UserAndRoomShema;
