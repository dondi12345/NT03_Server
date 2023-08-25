import { IMSGChat } from '../Model/MSGChat';
export declare function SendChat(msgChat: IMSGChat): void;
export declare function ReciveChat(msgChat: IMSGChat): void;
export declare function addChatToRedis(IdChatChannel: string, chat: string): void;
