"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = void 0;
var connector_1 = __importDefault(require("./connector"));
var UserAndRoomShema_1 = require("./models/UserAndRoomShema");
var User_1 = require("./models/User");
var Room_1 = require("./models/Room");
var Message_1 = require("./models/Message");
var Conversation_1 = require("./models/Conversation");
var Operations = /** @class */ (function () {
    function Operations() {
        this.userAndRooms = connector_1.default.model("_user_room", UserAndRoomShema_1.UserAndRoomShema());
        this.user = connector_1.default.model("_user", User_1.UserShema());
        this.room = connector_1.default.model("_room", Room_1.RoomShema());
        this.message = connector_1.default.model("_message", Message_1.MessageSchema());
        this.conversation = connector_1.default.model("_conversation", Conversation_1.ConversationSchema());
    }
    return Operations;
}());
exports.Operations = Operations;
