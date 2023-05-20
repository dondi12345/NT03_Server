import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../other/Env';

export interface IUserPlayer{
    _id? : Types.ObjectId;
    LastDate : Number;
    loginStreak : Number;
    IdChatGlobal? : Types.ObjectId;
    IdChatGuild? : Types.ObjectId;
}

export class UserPlayer implements IUserPlayer{
    _id? : Types.ObjectId;
    LastDate: Number;
    loginStreak: Number;
    IdChatGlobal? : Types.ObjectId;
    IdChatGuild? : Types.ObjectId;

    constructor() {
        
    }

    static Parse(data) : IUserPlayer{
        try{
            data = JSON.parse(data);
        }catch(err){}
        var userPlayer = new UserPlayer();
        userPlayer._id = data._id;
        userPlayer.LastDate = data.lastDate;
        userPlayer.loginStreak = data.loginStreak;
        userPlayer.IdChatGlobal = data?.idChatGlobal ? data.idChatGlobal : null;
        userPlayer.IdChatGuild = data?.idChatGuild ? data.idChatGuild : null;
        return userPlayer;
    }
}

const UserPlayerSchema = new Schema<IUserPlayer>(
    {
      _id : { type: Types.ObjectId},
      LastDate: Number,
      loginStreak : Number,
      IdChatGlobal : { type: Types.ObjectId},
      IdChatGuild : { type: Types.ObjectId},
    }
);
  
export const UserPlayerModel = mongoose.model<IUserPlayer>('UserPlayer', UserPlayerSchema);

export async function GetUserPlayerById(_id : Types.ObjectId){
    var userPlayer = new UserPlayer();
    await UserPlayerModel.findById(_id).then((res)=>{
        userPlayer = UserPlayer.Parse(res);
    }).catch((err)=>{
        console.log(err);
    })
    return userPlayer;
}