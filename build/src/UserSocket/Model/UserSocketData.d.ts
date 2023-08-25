import { Types } from "mongoose";
export interface IUserSocketData {
    IdUserPlayer: Types.ObjectId;
    IdSocket: String;
}
export declare class UserSocketData implements IUserSocketData {
    IdUserPlayer: Types.ObjectId;
    IdSocket: String;
    static Parse(data: any): IUserSocketData;
}
