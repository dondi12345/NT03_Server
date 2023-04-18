import mongoose, { Schema, ObjectId } from 'mongoose';

export interface IUserPlayer{
    _id : ObjectId;
    lastDate : Number;
    loginStreak : Number;
    idChatChannels : ObjectId[];
}

export class UserPlayer implements IUserPlayer{
    _id: Schema.Types.ObjectId;
    lastDate: Number;
    loginStreak: Number;
    idChatChannels : ObjectId[];

    constructor() {
        
    }

    static Parse(data) : UserPlayer{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const UserPlayerSchema = new Schema<IUserPlayer>(
    {
      _id : { type: mongoose.Schema.Types.ObjectId},
      lastDate: Number,
      loginStreak : Number,
      idChatChannels : [],
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