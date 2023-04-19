import { IMessage } from "../../Message/Model/Message";
import { Chat } from "../Model/Chat";
import { ChatChannel, ChatChannelModel, GetChatChannelById } from "../Model/ChatChannel";
import {variable, port} from "../../other/Env";
import { ChatCode } from "../ChatCode";
import redis from 'redis';
import { UserPlayerChatChannel } from "../Model/UserPlayerChatChannel";
import { GetUserPlayerById, UserPlayer, IUserPlayer } from "../../UserPlayer/UserPlayer";
import mongoose, { Schema, ObjectId } from 'mongoose';
import { SendMessage } from "../../AppChild";
import { Socket } from "socket.io";

const redisChat = redis.createClient();

const redisPublisher = redis.createClient();

let userPlayerChatChannels : UserPlayerChatChannel[] = []

export function ConnectToChat(idUser : ObjectId, socket : Socket){
    GetUserPlayerById(idUser).then((res : UserPlayer)=>{
        var userPlayerChatChannel = new UserPlayerChatChannel();
        userPlayerChatChannel.socket = socket;
        userPlayerChatChannel.idChatChannels = [];
        try{
            var userPlayer = UserPlayer.Parse(res);
            console.log(JSON.stringify(userPlayer) + `\n`);
            if(userPlayer.idChatGlobal != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGlobal)
            if(userPlayer.idChatGuild != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGuild)
            console.log(JSON.stringify(userPlayerChatChannel.idChatChannels)+ `\n`);
            userPlayerChatChannel.idUser = idUser;
        }catch(err){
            console.log("GetUserPlayerById: \n" + err)
            var idChatGlobal = new mongoose.Schema.Types.ObjectId(variable.idChatGlobal);
            userPlayerChatChannel.idChatChannels.push(idChatGlobal);
            userPlayerChatChannel.idUser = idUser;
        }
        AddUserPlayerChatChannel(userPlayerChatChannel, socket);
    }).catch((err)=>{
        console.log(err);
    })
}

function AddUserPlayerChatChannel(userPlayerChatChannel: UserPlayerChatChannel, socket : Socket){
    for (let index = 0; index < userPlayerChatChannels.length; index++) {
        const element = userPlayerChatChannels[index];
        console.log(userPlayerChatChannel.idUser + ' - ' + element.idUser + ": " + (userPlayerChatChannel.idUser == element.idUser));
        if(element.idUser == userPlayerChatChannel.idUser){
            console.log("Update userPlayerChatChannel");
            element.idChatChannels = userPlayerChatChannel.idChatChannels;
            element.socket.disconnect;
            element.socket = socket;
            return;
        }
    }
    userPlayerChatChannels.push(userPlayerChatChannel);
    console.log("New userPlayerChatChannel: "+ userPlayerChatChannels.length);
}

export function ClientSendGlobalChat(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    chat.chatCode = ChatCode.reciveChat;
    message.data = chat;
    if(chat.content.length == 0) return;
    GetChatChannelById(chat.idChatChannel).then((res : ChatChannel) => {
        console.log("findout chatChannel: " + JSON.stringify(res));
        redisPublisher.publish(variable.worker, JSON.stringify(message));
        addChatToRedis(JSON.stringify(res._id), JSON.stringify(chat));
    })
}

export function ServerSendGlobalChat(message : IMessage){
    var chat = Chat.Parse(message.data);
    var chatData : string = JSON.stringify(chat);
    message.data = chatData;
    var messageData :string = JSON.stringify(message);
    console.log("ServerSendGlobalChat: "+ chatData +`\n`);
    userPlayerChatChannels.forEach(element => {
        if(UserPlayerChatChannel.ExistChatChannel(chat.idChatChannel, element)){
            console.log("ChatServerSendGMessage: "+ messageData +`\n`);
            element.socket.emit(variable.eventSocketListening, messageData);
        }
    });
}

export function addChatToRedis(idChatChannel :string, chat: string) {
    redisChat.rpush(idChatChannel, chat, (error, result) => {
        if (error) {
            console.error('Failed to add chat message:', error);
        } else {
            console.log(`Chat message added ${result}: `, chat);
            // Remove oldest message if we have more than MAX_CHAT
            if (result > variable.maxLengthChat) {
                // redisChat.lpop(idChatChannel, (error, result) => {
                //     if (error) {
                //     console.error('Failed to remove oldest chat message:', error);
                //     } else {
                //     console.log('Oldest chat message removed:', result);
                //     }
                // });
                redisChat.ltrim(idChatChannel, result - variable.maxLengthChat, -1, (error, result) => {
                    if (error) {
                        console.error('Failed to remove oldest chat message:', error);
                    } else {
                        console.log('Oldest chat message removed:', result);
                    }
                });
            }
        }
    });
}