import { Socket } from "socket.io";
import { Message } from "../Model/Message";
import { IUserSocket, UserSocketDictionary } from "../../UserSocket/Model/UserSocket";
export declare let userSocketDictionary: UserSocketDictionary;
export declare function InitMessageServerWithSocket(): void;
export declare function AddUserSocketDictionary(userSocket: IUserSocket): void;
export declare function SendMessageToSocket(message: Message, socket: Socket): void;
