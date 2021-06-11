"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserShema = void 0;
var mongoose_1 = require("mongoose");
var UserShema = function () {
    return new mongoose_1.Schema({
        usid: {
            type: String,
            index: true,
            unique: true,
        },
        sok: {
            type: String,
            index: true,
            unique: true,
        },
        rmid: String,
        name: String,
        active: Boolean,
    });
};
exports.UserShema = UserShema;
