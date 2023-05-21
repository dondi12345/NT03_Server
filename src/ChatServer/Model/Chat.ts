import { Socket } from "socket.io";
import mongoose, { Schema, Types } from 'mongoose';
import { MSGChatCode } from "./MSGChatCode";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IChat{
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket ?: Socket,
    Time : Date;
    Content : string;
}

export class Chat implements IChat {
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket?: Socket;
    Time : Date = new Date;
    Content : string;

    constructor() {
        
    }

    static ToString(chat : IChat){
        var data = new Chat();
        data.IdChatChannel = chat.IdChatChannel;
        data.IdUserPlayer = chat.IdUserPlayer;
        data.Time = chat.Time;
        data.Content = chat.Content;
        return JSON.stringify(data);
    }

    static Parse(data) : Chat{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}