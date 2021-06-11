import { Document, Schema } from 'mongoose';

export interface RoomModel extends Document {
    rmid: string;
    name: string;
}

export const RoomShema = () => {
    return new Schema<RoomModel>({
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
