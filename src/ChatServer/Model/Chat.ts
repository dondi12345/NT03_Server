import { Socket } from "socket.io";
import mongoose, { Schema, Types } from 'mongoose';
import { MSGChatCode } from "./MSGChatCode";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IChat{
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Time : Date;
    Content : string;
}

export class Chat implements IChat {
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Time : Date = new Date;
    Content : string;

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