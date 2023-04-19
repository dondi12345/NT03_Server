import { IMessage } from "../../Message/Model/Message";
import { Chat } from "../Model/Chat";
import { ChatChannel, ChatChannelModel, GetChatChannelById } from "../Model/ChatChannel";
import {variable} from "../../other/Env";
import { ChatCode } from "../ChatCode";
import redis from 'redis';
import { UserPlayerChatChannel } from "../Model/UserPlayerChatChannel";
import { GetUserPlayerById, UserPlayer, IUserPlayer } from "../../UserPlayer/UserPlayer";
import mongoose, { Schema, ObjectId } from 'mongoose';
import { SendMessage } from "../../AppChild";

const redisPublisher = redis.createClient();

let userPlayerChatChannels : UserPlayerChatChannel[] = []

export function ConnectToChat(message : IMessage){
    GetUserPlayerById(message.idUser).then((res : UserPlayer)=>{
        var userPlayerChatChannel = new UserPlayerChatChannel();
        userPlayerChatChannel.socketId = message.socketId;
        userPlayerChatChannel.idChatChannels = [];
        try{
            var userPlayer = UserPlayer.Parse(res);
            console.log(JSON.stringify(userPlayer) + `\n`);
            if(userPlayer.idChatGlobal != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGlobal)
            if(userPlayer.idChatGuild != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGuild)
            console.log(JSON.stringify(userPlayerChatChannel.idChatChannels)+ `\n`);
            userPlayerChatChannel.idUser = message.idUser;
        }catch(err){
            console.log("GetUserPlayerById: \n" + err)
            var idChatGlobal = new mongoose.Schema.Types.ObjectId(variable.idChatGlobal);
            userPlayerChatChannel.idChatChannels.push(idChatGlobal);
            userPlayerChatChannel.idUser = message.idUser;
        }
        AddUserPlayerChatChannel(userPlayerChatChannel);
    }).catch((err)=>{
        console.log(err);
    })
}

function AddUserPlayerChatChannel(userPlayerChatChannel: UserPlayerChatChannel){
    for (let index = 0; index < userPlayerChatChannels.length; index++) {
        const element = userPlayerChatChannels[index];
        console.log(userPlayerChatChannel.idUser + ' - ' + element.idUser + ": " + (userPlayerChatChannel.idUser == element.idUser));
        if(element.idUser == userPlayerChatChannel.idUser){
            console.log("Update userPlayerChatChannel");
            element.idChatChannels = userPlayerChatChannel.idChatChannels;
            return;
        }
    }
    userPlayerChatChannels.push(userPlayerChatChannel);
    console.log("New userPlayerChatChannel: "+ userPlayerChatChannels.length);
}

export function ClientSendGlobalChat(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    message.data = chat;
    if(chat.content.length == 0) return;
    GetChatChannelById(chat.idChatChannel).then((res : ChatChannel) => {
        res.chats.push(chat);
        if(res.chats.length > variable.maxLengthChat) res.chats.shift();
        console.log("findout chatChannel: " + JSON.stringify(res));
        ChatChannelModel.updateOne({_id : res._id}, {chats : res.chats}).then((res)=>{
            console.log("insert chat to db:");
            chat.chatCode = ChatCode.reciveGlobal;
            message.data = chat;
            redisPublisher.publish(variable.worker, JSON.stringify(message));
        }).catch((err)=>{
            console.log("can't update chatChannel " + err)
        });
    })
}

export function ServerSendGlobalChat(message : IMessage){
    var chat = Chat.Parse(message.data);
    message.data = chat;
    userPlayerChatChannels.forEach(element => {
        if(UserPlayerChatChannel.ExistChatChannel(chat.idChatChannel, element)){
            SendMessage(message, element.idUser);
        }
    });
}