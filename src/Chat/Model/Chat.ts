import { ChatCode } from "../ChatCode";
import mongoose, { Schema, ObjectId } from 'mongoose';

export interface IChat{
    chatCode : ChatCode;
    idChatChannel : ObjectId;
    idUser : ObjectId;
    time : Date;
    content : string;
}

export class Chat implements IChat {
    chatCode : ChatCode;
    idChatChannel : ObjectId;
    idUser : ObjectId;
    time : Date = new Date;
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