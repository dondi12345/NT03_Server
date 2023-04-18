import mongoose, { Schema, ObjectId } from 'mongoose';
import { Chat } from './Chat';
import { variable } from '../../other/Env';

export interface IChatChannel{
    _id : ObjectId;
    detail : string;
    chats: Chat[];
}

export class ChatChannel implements IChatChannel{
    _id: ObjectId;
    detail: string;
    chats: Chat[];

    constructor(data) {
        this._id = data._id;
        this.detail = data.detail;
        this.chats = data.chats;
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
      _id : { type: mongoose.Schema.Types.ObjectId},
      detail: String,
      chats : [],
    }
);
  
export const ChatChannelModel = mongoose.model<IChatChannel>('ChatChannel', ChatChannelSchema);

export async function GetChatChannelById(_id : ObjectId){
    var chatChannel = new ChatChannel({}); 
    await ChatChannelModel.findById(_id).then((res)=>{
        chatChannel = new ChatChannel(res);
    }).catch((err)=>{
        chatChannel = new ChatChannel({});
    });
    return chatChannel;

}