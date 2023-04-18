import { ChatCode } from "../ChatCode";
import mongoose, { Schema, ObjectId } from 'mongoose';

export interface IChat{
    chatCode : ChatCode;
    idChatChannel : ObjectId;
    idUser : ObjectId;
    content : string;
}

export class Chat implements IChat {
    chatCode : ChatCode;
    idChatChannel : ObjectId;
    idUser : ObjectId;
    content : string;

    constructor() {
        
    }

    static Parse(data) : Chat{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const ChatSchema = new Schema<IChat>(
    {
        chatCode : {type : Number, enum : ChatCode},
        idChatChannel : { type: mongoose.Schema.Types.ObjectId, ref: 'ChatChannel' },
        idUser : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content : String,
    }
);
  
export const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);