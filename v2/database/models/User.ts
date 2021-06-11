import { Document, Schema } from 'mongoose';

export interface UserModel extends Document {
    usid: string;
    sok: string;
    rmid: string;
    name: string;
    active: boolean;
}

export const UserShema = () => {
    return new Schema<UserModel>({
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
