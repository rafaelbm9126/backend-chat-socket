import { Model } from 'mongoose';
import mongoose from '../connector';
import { UserShema, UserModel } from './User';
import { RoomShema, RoomModel } from './Room';
import { UserAndRoomShema, UserAndRoomsModel } from './UserAndRoomShema';
import { MessageSchema, MessageModel } from './Message';
import { ConversationSchema, ConversationModel } from './Conversation';

export {
    UserModel,
    RoomModel,
    UserAndRoomsModel,
    MessageModel,
    ConversationModel,
};

export class ModelsOperations {
    public user: Model<UserModel>;
    public room: Model<RoomModel>;
    public userAndRooms: Model<UserAndRoomsModel>;
    public message: Model<MessageModel>;
    public conversation: Model<ConversationModel>;

    constructor() {
        this.user = mongoose.model<UserModel>("_user", UserShema());
        this.room = mongoose.model<RoomModel>("_room", RoomShema());
        this.userAndRooms = mongoose.model<UserAndRoomsModel>("_user_room", UserAndRoomShema());
        this.message = mongoose.model<MessageModel>("_message", MessageSchema());
        this.conversation = mongoose.model<ConversationModel>(
            "_conversation",
            ConversationSchema()
        );
    }
}
