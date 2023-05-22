import mongoose from "mongoose";
import { Schema, Types } from "mongoose";
import { ServerGameCode } from "../../UserPlayerServer/Model/ServerGameCode";

export enum TyppeChatChannelCode{
    Global = 10000,
    Guild = 10001,
}

export interface IChatChannel{
    _id : Types.ObjectId;
    TyppeChatChannelCode : TyppeChatChannelCode;
    ServerGameCode : ServerGameCode;
    Detail : string;
}

export class ChatChannel implements IChatChannel{
    _id: Types.ObjectId;
    TyppeChatChannelCode : TyppeChatChannelCode;
    ServerGameCode : ServerGameCode;
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
        ServerGameCode : {type : Number, enum : ServerGameCode},
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

export async function FindGlobalChannel(serverGameCode : ServerGameCode) {
    var globalChannel;
    await ChatChannelModel.findOne({TyppeChatChannelCode : TyppeChatChannelCode.Global, ServerGameCode : serverGameCode}).then(async res=>{
        if(res == null || res == undefined){
            var newGlobalChannel = new ChatChannel();
            newGlobalChannel.Detail = "Global channel of SV"+serverGameCode;
            newGlobalChannel.ServerGameCode = serverGameCode;
            newGlobalChannel.TyppeChatChannelCode = TyppeChatChannelCode.Global;
            await CreateChatChannel(newGlobalChannel).then(res1=>{
                globalChannel = res1
            }) 
        }else{
            globalChannel = res;
        }
    })
    return globalChannel;
}