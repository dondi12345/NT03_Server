import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../../other/Env';

export interface IUserPlayer{
    _id : Types.ObjectId;
    Username?: String;
    Password?: String;
}

export class UserPlayer implements IUserPlayer{
    _id : Types.ObjectId = new Types.ObjectId();
    Username?: String;
    Password?: String;

    constructor() {
        
    }

    static Parse(data) : IUserPlayer{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const UserPlayerSchema = new Schema<IUserPlayer>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      Username :{type : String},
      Password : { type: String}
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

export async function CreateUserPlayer(userPlayer:UserPlayer) {
    var newUserPlayer
    await UserPlayerModel.create(userPlayer).then(res=>{
        newUserPlayer = res;
    })
    return newUserPlayer
}

export async function FindByUserName(userPlayer : UserPlayer){
    var userPlayerFO;
    await UserPlayerModel.findOne({Username : userPlayer.Username}).then(res=>{
        userPlayerFO = res;
    })
    return userPlayerFO;
}