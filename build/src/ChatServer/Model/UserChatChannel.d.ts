import mongoose, { Types } from "mongoose";
import { ServerGameCode } from "../../UserPlayerServer/Model/ServerGameCode";
export interface IUserChatChannel {
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    IdChatChannel: Types.ObjectId;
}
export declare class UserChatChannel implements IUserChatChannel {
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    IdChatChannel: Types.ObjectId;
    static Parse(data: any): UserChatChannel;
}
export declare const UserChatChannelModel: mongoose.Model<IUserChatChannel, {}, {}, {}, mongoose.Document<unknown, {}, IUserChatChannel> & Omit<IUserChatChannel & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function GetIdUserPlayerByIdChatChannel(IdChatChannel: Types.ObjectId): Promise<UserChatChannel[]>;
export declare function UserJoinToChatChannel(idUserPlayer: Types.ObjectId, idChatChannel: Types.ObjectId): Promise<void>;
export declare function UserJoinToGlobalChannel(idUserPlayer: Types.ObjectId, serverGameCode: ServerGameCode): Promise<void>;
