import mongoose, { Types } from "mongoose";
import { IChatChannel } from "./ChatChannel";
import { Schema } from "mongoose";

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
        console.log("1684576640 "+ res)
        if(res.length > 0){
            data = res;
        }
    })
    return data;
}