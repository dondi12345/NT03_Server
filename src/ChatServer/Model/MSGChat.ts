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

    static Parse(data) : IMSGChat{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}