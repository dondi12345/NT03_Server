import mongoose, { Schema, ObjectId } from 'mongoose';
import { variable } from '../other/Env';

export interface IUserPlayer{
    _id : ObjectId;
    lastDate : Number;
    loginStreak : Number;
    idChatGlobal? : ObjectId;
    idChatGuild? : ObjectId;
}

export class UserPlayer implements IUserPlayer{
    _id: Schema.Types.ObjectId;
    lastDate: Number;
    loginStreak: Number;
    idChatGlobal? : ObjectId;
    idChatGuild? : ObjectId;

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
      _id : { type: mongoose.Schema.Types.ObjectId},
      lastDate: Number,
      loginStreak : Number,
      idChatGlobal : { type: mongoose.Schema.Types.ObjectId},
      idChatGuild : { type: mongoose.Schema.Types.ObjectId},
    }
);
  
export const UserPlayerModel = mongoose.model<IUserPlayer>('UserPlayer', UserPlayerSchema);

export async function GetUserPlayerById(_id : ObjectId){
    var userPlayer = new UserPlayer();
    await UserPlayerModel.findById(_id).then((res)=>{
        userPlayer = UserPlayer.Parse(res);
    }).catch((err)=>{
        console.log(err);
    })
    return userPlayer;
}