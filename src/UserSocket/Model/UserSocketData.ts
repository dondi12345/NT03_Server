import { Types } from "mongoose";

export interface IUserSocketData{
    IdUserPlayer : Types.ObjectId,
    IdSocket : String,
}

export class UserSocketData implements IUserSocketData{
    IdUserPlayer : Types.ObjectId;
    IdSocket : String;

    static Parse(data) : IUserSocketData{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}