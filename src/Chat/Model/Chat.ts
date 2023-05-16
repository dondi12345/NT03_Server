import { ChatCode } from "../ChatCode";
import mongoose, { Schema, Types } from 'mongoose';

export interface IChat{
    chatCode : ChatCode;
    idChatChannel : Types.ObjectId;
    idUser : Types.ObjectId;
    time : Date;
    content : string;
}

export class Chat implements IChat {
    chatCode : ChatCode;
    idChatChannel : Types.ObjectId;
    idUser : Types.ObjectId;
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