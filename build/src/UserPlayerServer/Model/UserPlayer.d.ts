import mongoose, { Types } from 'mongoose';
import { ServerGameCode } from './ServerGameCode';
import { Socket } from "socket.io";
export type UserPlayerSocketDictionary = Record<string, UserPlayerSocket>;
export declare class UserPlayerSocket {
    Token: string;
    UserPlayerId: string;
    Socket: Socket;
}
export declare class UserPlayerWithToken {
    Token: string;
    UserPlayerId: string;
}
export interface IUserPlayer {
    _id: Types.ObjectId;
    IdAccount: Types.ObjectId;
    ServerGameCode: ServerGameCode;
    PlayerName: string;
    Wave: number;
}
export declare class UserPlayer implements IUserPlayer {
    _id: Types.ObjectId;
    IdAccount: Types.ObjectId;
    ServerGameCode: ServerGameCode;
    PlayerName: string;
    Wave: number;
    constructor();
    static NewUserPlayer(idAccount: Types.ObjectId, serverGameCode: ServerGameCode): UserPlayer;
    static Parse(data: any): IUserPlayer;
}
export declare const UserPlayerModel: mongoose.Model<IUserPlayer, {}, {}, {}, mongoose.Document<unknown, {}, IUserPlayer> & Omit<IUserPlayer & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function GetUserPlayerById(_id: Types.ObjectId): Promise<UserPlayer>;
export declare function CreateUserPlayer(userPlayer: UserPlayer): Promise<any>;
export declare function FindByIdAccountAndServerGameCode(idAccount: Types.ObjectId, serverGameCode: ServerGameCode): Promise<any>;
export declare function UpdateUserPlayer(userPlayer: UserPlayer): Promise<void>;
