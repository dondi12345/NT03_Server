import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../../Enviroment/Env';
import { ServerGameCode } from './ServerGameCode';
import { LogIdUserPlayer, LogUserSocket } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';

export interface IUserPlayer{
    _id : Types.ObjectId;
    IdAccount : Types.ObjectId;
    ServerGameCode : ServerGameCode;
    Name : string;

    Wave : number;
}

export class UserPlayer implements IUserPlayer{
    _id : Types.ObjectId = new Types.ObjectId();
    IdAccount : Types.ObjectId;
    ServerGameCode : ServerGameCode;
    Name : string = "Player"+ (10000+Math.floor(Math.random()*90000));

    Wave : number = 0;

    constructor() {
        
    }

    static NewUserPlayer(idAccount : Types.ObjectId, serverGameCode : ServerGameCode){
        var userPlayer = new UserPlayer();
        userPlayer.IdAccount = idAccount;
        userPlayer.ServerGameCode = serverGameCode;
        return userPlayer;
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
      ServerGameCode : {type : Number, enum : ServerGameCode},
      Wave : {type : Number, default : 0}
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

export async function UpdateUserPlayer(userPlayer : UserPlayer) {
    console.log("Dev 1688027507 ", userPlayer);
    UserPlayerModel.updateOne({_id : userPlayer._id},{
        ServerGameCode : userPlayer.ServerGameCode,
        Name : userPlayer.Name,
        Wave : userPlayer.Wave ? userPlayer.Wave : 0,
    }).then(res=>{
        console.log("Dev 1687943868 ", res);
    }).catch(e=>{
        LogIdUserPlayer(LogCode.UserPlayerServer_SaveFail, userPlayer._id.toString(), e);
    })
}