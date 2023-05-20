import mongoose, { Schema, Types } from 'mongoose';
import { MessageCode } from "./MessageCode";
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface IMessage{
    messageCode : MessageCode;
    IdUserPlayer : Types.ObjectId,
    socket? : Socket,
    data : any;
}

export class Message implements IMessage {
    messageCode: MessageCode;                              
    IdUserPlayer: Types.ObjectId = new Types.ObjectId("012345678910111213141516");
    socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
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