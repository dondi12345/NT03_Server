import { Socket } from "socket.io";
import mongoose, { Schema, Types } from 'mongoose';
import { ChatCode } from "./ChatCode";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IChat{
    ChatCode : ChatCode;
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    socket ?: Socket,
    time : Date;
    content : string;
}

export class Chat implements IChat {
    ChatCode : ChatCode;
    IdChatChannel : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    socket?: Socket;
    time : Date = new Date;
    content : string;

    constructor() {
        
    }

    static ToString(chat : IChat){
        var data = new Chat();
        data.ChatCode = chat.ChatCode;
        data.IdChatChannel = chat.IdChatChannel;
        data.IdUserPlayer = chat.IdUserPlayer;
        data.time = chat.time;
        data.content = chat.content;
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