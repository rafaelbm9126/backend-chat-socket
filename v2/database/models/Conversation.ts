import { Document, Schema } from 'mongoose';

export interface ConversationModel extends Document {
    a: string;
    b: string;
}

export const ConversationSchema = () => {
    return new Schema<ConversationModel>({
        a: String,
        b: String,
    });
};
