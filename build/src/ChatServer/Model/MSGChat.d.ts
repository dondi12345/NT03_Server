import { Socket } from "socket.io";
import { Types } from 'mongoose';
import { MSGChatCode } from "./MSGChatCode";
export interface IMSGChat {
    MSGChatCode: MSGChatCode;
    IdUserPlayer: Types.ObjectId;
    Socket?: Socket;
    Data: string;
}
export declare class MSGChat implements IMSGChat {
    MSGChatCode: MSGChatCode;
    IdUserPlayer: Types.ObjectId;
    Socket?: Socket;
    Data: string;
    constructor();
    static Parse(data: any): IMSGChat;
}
