"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsOperations = void 0;
var connector_1 = __importDefault(require("../connector"));
var User_1 = require("./User");
var UserAndRoomShema_1 = require("./UserAndRoomShema");
var Room_1 = require("./Room");
var Message_1 = require("./Message");
var Conversation_1 = require("./Conversation");
var ModelsOperations = /** @class */ (function () {
    function ModelsOperations() {
        this.user = connector_1.default.model("_user", User_1.UserShema());
        this.userAndRooms = connector_1.default.model("_user_room", UserAndRoomShema_1.UserAndRoomShema());
        this.room = connector_1.default.model("_room", Room_1.RoomShema());
        this.message = connector_1.default.model("_message", Message_1.MessageSchema());
        this.conversation = connector_1.default.model("_conversation", Conversation_1.ConversationSchema());
    }
    return ModelsOperations;
}());
exports.ModelsOperations = ModelsOperations;
