import { Document, Schema } from 'mongoose';

export interface MessageModel extends Document {
    usid: string;
    rmid: string;
    group: boolean;
    to: string;
    parley: string;
    msg: string;
    read: Array<string>;
}

export const MessageSchema = () => {
    return new Schema<MessageModel>({
        usid: String,
        rmid: String,
        group: Boolean,
        to: String,
        parley: String,
        msg: String,
        read: [String],
    });
};
