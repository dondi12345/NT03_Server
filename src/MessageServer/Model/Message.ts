import mongoose, { Schema, Types } from 'mongoose';
import { MessageCode } from "./MessageCode";
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface IMessage{
    MessageCode : MessageCode,
    Data : any,
}

export class Message implements IMessage {
    MessageCode: MessageCode;                              
    Data: any;

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