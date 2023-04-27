import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../other/Env';

export interface IUserPlayer{
    _id? : Types.ObjectId;
    lastDate : Number;
    loginStreak : Number;
    idChatGlobal? : Types.ObjectId;
    idChatGuild? : Types.ObjectId;
}

export class UserPlayer implements IUserPlayer{
    _id? : Types.ObjectId;
    lastDate: Number;
    loginStreak: Number;
    idChatGlobal? : Types.ObjectId;
    idChatGuild? : Types.ObjectId;

    constructor() {
        
    }

    static Parse(data) : IUserPlayer{
        try{
            data = JSON.parse(data);
        }catch(err){}
        var userPlayer = new UserPlayer();
        userPlayer._id = data._id;
        userPlayer.lastDate = data.lastDate;
        userPlayer.loginStreak = data.loginStreak;
        userPlayer.idChatGlobal = data?.idChatGlobal ? data.idChatGlobal : null;
        userPlayer.idChatGuild = data?.idChatGuild ? data.idChatGuild : null;
        return userPlayer;
    }
}

const UserPlayerSchema = new Schema<IUserPlayer>(
    {
      _id : { type: Types.ObjectId},
      lastDate: Number,
      loginStreak : Number,
      idChatGlobal : { type: Types.ObjectId},
      idChatGuild : { type: Types.ObjectId},
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