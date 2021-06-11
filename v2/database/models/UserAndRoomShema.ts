import { Document, Schema } from 'mongoose';

export interface UserAndRoomsModel extends Document {
    usid: string;
    rmid: string;
}

export const UserAndRoomShema = () => {
    return new Schema<UserAndRoomsModel>({
        usid: { type: String, required: true },
        rmid: { type: String, required: true },
    });
};
