import mongoose, { Schema, Types } from 'mongoose';
import { MessageCode } from "../MessageCode";

export interface IMessage{
    messageCode : MessageCode;
    socketId : string;
    idUser : Types.ObjectId,
    data : any;
}

export class Message implements IMessage {
    messageCode: MessageCode;
    socketId: string;
    idUser: Types.ObjectId;
    data: any;

    constructor() {
        
    }

    static Parse(data) : Message{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}