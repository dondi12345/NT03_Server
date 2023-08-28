import mongoose, { Schema, Types } from 'mongoose';
import { MessageCode } from "./MessageCode";
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class MessageData{
    Status : boolean;
    Data : string[];

    constructor(data:string[]){
        this.Status = true;
        this.Data = data;
    }
}

export class Message{  
    MessageCode : number;                           
    Data: any;
    Token : string;
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