import mongoose, { Schema, Types } from 'mongoose';
import { MessageCode } from "./MessageCode";
import { Socket } from 'socket.io';

export interface IMessage{
    messageCode : MessageCode;
    idUser : Types.ObjectId,
    socket? : Socket,
    data : any;
}

export class Message implements IMessage {
    messageCode: MessageCode;
    idUser: Types.ObjectId;
    socket? : Socket;
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