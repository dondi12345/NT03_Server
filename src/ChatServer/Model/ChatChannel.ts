import mongoose from "mongoose";
import { Schema, Types } from "mongoose";

export enum TyppeChatChannelCode{
    Global = 10000,
    Guild = 10001,
}

export interface IChatChannel{
    _id : Types.ObjectId;
    TyppeChatChannelCode : TyppeChatChannelCode;
    Detail : string;
}

export class ChatChannel implements IChatChannel{
    _id: Types.ObjectId;
    TyppeChatChannelCode : TyppeChatChannelCode;
    Detail: string;

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
        TyppeChatChannelCode : {type : Number, enum : TyppeChatChannelCode},
        Detail: String,
    }
);
  
export const ChatChannelModel = mongoose.model<IChatChannel>('ChatChannel', ChatChannelSchema);

export async function GetChatChannelById(_id : Types.ObjectId){
    var chatChannel; 
    await ChatChannelModel.findById(_id).then((res)=>{
        chatChannel = ChatChannel.Parse(res);
    }).catch((err)=>{
        chatChannel = null;
    });
    return chatChannel;
}

export async function CreateChatChannel(chatChannel : IChatChannel){
    var data;
    await ChatChannelModel.create(chatChannel).then((res=>{
        data = res;
    }))
    return data;
}