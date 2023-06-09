import mongoose, { Types } from "mongoose";
import { FindGlobalChannel, IChatChannel } from "./ChatChannel";
import { Schema } from "mongoose";
import { ServerGameCode } from "../../UserPlayerServer/Model/ServerGameCode";

export interface IUserChatChannel{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    IdChatChannel : Types.ObjectId;
}

export class UserChatChannel implements IUserChatChannel{
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    IdChatChannel: Types.ObjectId;

    static Parse(data) : UserChatChannel{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const UserChatChannelSchema = new Schema<IUserChatChannel>({
    IdUserPlayer : {type: mongoose.Schema.Types.ObjectId, ref : 'UserPlayer'},
    IdChatChannel : {type: mongoose.Schema.Types.ObjectId, ref : 'ChatChannel'}
});

export const UserChatChannelModel = mongoose.model<IUserChatChannel>('UserChatChannel', UserChatChannelSchema);

export async function GetIdUserPlayerByIdChatChannel(IdChatChannel : Types.ObjectId){
    var data : UserChatChannel[]= [];
    await UserChatChannelModel.find({IdChatChannel: IdChatChannel.toString()}).then(res=>{
        console.log("Dev 1684576640 "+ res.length)
        if(res.length > 0){
            data = res;
        }
    })
    return data;
}

export async function UserJoinToChatChannel(idUserPlayer: Types.ObjectId, idChatChannel: Types.ObjectId){
    await UserChatChannelModel.find({IdChatChannel : idChatChannel, IdUserPlayer: idUserPlayer}).then(res=>{
        console.log("Dev 1684596592 " + res.length);
        if(res.length> 0) return;
        var userChatChannel = new UserChatChannel();
        userChatChannel.IdChatChannel = idChatChannel;
        userChatChannel.IdUserPlayer = idUserPlayer;
        UserChatChannelModel.create(userChatChannel);
    })
}

export async function UserJoinToGlobalChannel(idUserPlayer: Types.ObjectId, serverGameCode : ServerGameCode) {
    await FindGlobalChannel(serverGameCode).then((res : IChatChannel) =>{
        try {
            UserJoinToChatChannel(idUserPlayer, res._id);
        } catch (error) {
            console.log("Dev 1684663387 "+error);
        }
    })
}