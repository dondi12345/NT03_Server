import { Socket } from "socket.io";
import mongoose, { Schema, Types } from 'mongoose';
import { MSGChatCode } from "./MSGChatCode";

export interface IMSGChat{
    MSGChatCode : MSGChatCode;
    IdUserPlayer : Types.ObjectId;
    Socket ?: Socket,
    Data : string;
}

export class MSGChat implements IMSGChat {
    MSGChatCode : MSGChatCode;
    IdUserPlayer : Types.ObjectId;
    Socket?: Socket;
    Data : string;

    constructor() {
        
    }

    static ToString(msgChat : IMSGChat){
        var data = new MSGChat();
        data.MSGChatCode = msgChat.MSGChatCode;
        data.IdUserPlayer = msgChat.IdUserPlayer;
        data.Data = msgChat.Data;
        return JSON.stringify(data);
    }

    static Parse(data) : IMSGChat{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}