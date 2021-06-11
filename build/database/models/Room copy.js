"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomShema = void 0;
var mongoose_1 = require("mongoose");
var RoomShema = function () {
    return new mongoose_1.Schema({
        rmid: {
            type: String,
            index: true,
            unique: true
        },
        name: {
            type: String,
            unique: true
        }
    });
};
exports.RoomShema = RoomShema;
