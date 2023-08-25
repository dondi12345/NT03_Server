import mongoose from "mongoose";
import { Types } from "mongoose";
import { ServerGameCode } from "../../UserPlayerServer/Model/ServerGameCode";
export declare enum TyppeChatChannelCode {
    Global = 10000,
    Guild = 10001
}
export interface IChatChannel {
    _id: Types.ObjectId;
    TyppeChatChannelCode: TyppeChatChannelCode;
    ServerGameCode: ServerGameCode;
    Detail: string;
}
export declare class ChatChannel implements IChatChannel {
    _id: Types.ObjectId;
    TyppeChatChannelCode: TyppeChatChannelCode;
    ServerGameCode: ServerGameCode;
    Detail: string;
    static Parse(data: any): ChatChannel;
}
export declare const ChatChannelModel: mongoose.Model<IChatChannel, {}, {}, {}, mongoose.Document<unknown, {}, IChatChannel> & Omit<IChatChannel & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function GetChatChannelById(_id: Types.ObjectId): Promise<any>;
export declare function CreateChatChannel(chatChannel: IChatChannel): Promise<any>;
export declare function FindGlobalChannel(serverGameCode: ServerGameCode): Promise<any>;
