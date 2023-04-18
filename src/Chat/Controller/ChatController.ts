import { IMessage } from "../../Message/Model/Message";
import { Chat } from "../Model/Chat";
import { ChatChannel, ChatChannelModel, GetChatChannelById } from "../Model/ChatChannel";
import {variable} from "../../other/Env";
import { ChatCode } from "../ChatCode";
import redis from 'redis';
import { UserPlayerChatChannel } from "../Model/UserPlayerChatChannel";
import { GetUserPlayerById, UserPlayer } from "../../UserPlayer/UserPlayer";
import mongoose, { Schema, ObjectId } from 'mongoose';

const redisPublisher = redis.createClient();

let userPlayerChatChannels : UserPlayerChatChannel[]

export function ConnectToChat(message : IMessage){
    var userPlayerChatChannel = new UserPlayerChatChannel();
    userPlayerChatChannel.socketId = message.socketId;
    GetUserPlayerById(message.idUser).then((res : UserPlayer)=>{
        try{
            userPlayerChatChannel.idChatChannels = res.idChatChannels;
            userPlayerChatChannel.idUser = res._id;
        }catch(err){
            userPlayerChatChannel.idChatChannels.push(new mongoose.Schema.Types.ObjectId(variable.idChatGlobal));
            userPlayerChatChannel.idUser = res._id;
        }
        userPlayerChatChannels.push(userPlayerChatChannel);
        console.log(JSON.stringify(userPlayerChatChannels));
    }).catch((err)=>{
        console.log(err);
    })
}

export function ClientSendGlobalChat(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    if(chat.content.length == 0) return;
    GetChatChannelById(chat.idChatChannel).then((res : ChatChannel) => {
        res.chats.push(chat);
        if(res.chats.length > variable.maxLengthChat) res.chats.shift();
        ChatChannelModel.updateOne(res).then((res)=>{
            chat.chatCode = ChatCode.reciveGlobal;
            message.data = chat;
            redisPublisher.publish(variable.worker, JSON.stringify(message));
        }).catch((err)=>{
            console.log("err: " + err)
        });
    })
}

export function ServerSendGlobalChat(message : IMessage){

}