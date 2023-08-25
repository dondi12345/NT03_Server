import { Types } from 'mongoose';
export interface IChat {
    IdChatChannel: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    Time: Date;
    Content: string;
}
export declare class Chat implements IChat {
    IdChatChannel: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    Time: Date;
    Content: string;
    constructor();
    static Parse(data: any): Chat;
}
