import mongoose, { Schema, Types } from 'mongoose';
import { Chat } from './Chat';
import { variable } from '../../other/Env';

export interface IChatChannel{
    _id : Types.ObjectId;
    detail : string;
}

export class ChatChannel implements IChatChannel{
    _id: Types.ObjectId;
    detail: string;

    constructor(data) {
        this._id = data._id;
        this.detail = data.detail;
    }

    static Parse(data) : ChatChannel{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const ChatChannelSchema = new Schema<IChatChannel>(
    {
      detail: String,
    }
);
  
export const ChatChannelModel = mongoose.model<IChatChannel>('ChatChannel', ChatChannelSchema);

export async function GetChatChannelById(_id : Types.ObjectId){
    var chatChannel = new ChatChannel({}); 
    await ChatChannelModel.findById(_id).then((res)=>{
        chatChannel = new ChatChannel(res);
    }).catch((err)=>{
        chatChannel = new ChatChannel({});
    });
    return chatChannel;

}