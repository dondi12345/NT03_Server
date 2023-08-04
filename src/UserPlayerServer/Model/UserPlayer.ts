import mongoose, { Schema, Types } from 'mongoose';
import { variable } from '../../Enviroment/Env';
import { ServerGameCode } from './ServerGameCode';
import { LogIdUserPlayer, LogServer, LogUserSocket } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';
import { Socket } from "socket.io";

export type UserPlayerSocketDictionary = Record<string, UserPlayerSocket>;

export class UserPlayerSocket{
    Token:string;
    UserPlayerId:string;
    Socket:Socket;
}

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
    }).catch(err=>{
        LogServer(LogCode.UserPlayerServer_CreateFail, err, LogType.Error);
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
        LogIdUserPlayer(LogCode.UserPlayerServer_SaveUserPlayer, userPlayer._id.toString(), "",LogType.Normal);
        console.log("Dev 1687943868 ", res);
    }).catch(e=>{
        LogIdUserPlayer(LogCode.UserPlayerServer_SaveFailUserPlayer, userPlayer._id.toString(), e, LogType.Error);
    })
}