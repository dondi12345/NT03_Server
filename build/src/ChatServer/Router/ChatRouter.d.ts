import { IMSGChat } from "../Model/MSGChat";
import { Socket } from "socket.io";
export declare function ChatRouter(msgChat: IMSGChat, socket: Socket): void;
export declare function ChatRouterWithoutSocket(msgChat: IMSGChat): void;
