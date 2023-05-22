import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../../other1/Env';
import { ServerGameCode } from './ServerGameCode';

export interface IUserPlayer{
    _id : Types.ObjectId;
    IdAccount : Types.ObjectId;
    ServerGameCode : ServerGameCode;
}

export class UserPlayer implements IUserPlayer{
    _id : Types.ObjectId = new Types.ObjectId();
    IdAccount : Types.ObjectId;
    ServerGameCode : ServerGameCode;

    constructor() {
        
    }

    static ToString(data : IUserPlayer){
        var userPlayer = new UserPlayer;
        userPlayer._id = data._id;
        userPlayer.IdAccount = data.IdAccount;
        userPlayer.ServerGameCode = data.ServerGameCode;
        return JSON.stringify(userPlayer);
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
      IdAccount: {type: Schema.Types.ObjectId, ref : 'Account'},
      ServerGameCode : {type : Number, enum : ServerGameCode}
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

export async function FindByIdAccountAndServerGameCode(idAccount : Types.ObjectId, serverGameCode : ServerGameCode) {
    var userPlayer;
    await UserPlayerModel.findOne({IdAccount : idAccount, ServerGameCode : serverGameCode}).then((res)=>{
        userPlayer = UserPlayer.Parse(res);
    })
    return userPlayer;
}