import { Socket } from "socket.io";
import { UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { IMSGChat } from "../Model/MSGChat";
export declare let userSocketChatServer: UserSocketServer;
export declare let isChatServerUseSocket: boolean;
export declare function InitChatServer(): void;
export declare function SendToSocket(msgChat: IMSGChat, socket: Socket): void;
export declare function SendToSocketById(idUserPlayer: string, msgChat: IMSGChat): void;
