import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { Message } from "../Model/Message";
export declare function Connect(message: Message, userSocket: IUserSocket): Promise<void>;
