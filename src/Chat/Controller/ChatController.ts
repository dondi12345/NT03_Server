import { IMessage } from "../../Message/Model/Message";
import { Chat } from "../Model/Chat";
import { ChatChannel, ChatChannelModel, GetChatChannelById } from "../Model/ChatChannel";
import {variable, port} from "../../other/Env";
import { ChatCode } from "../ChatCode";
import redis from 'redis';
import { UserPlayerChatChannel } from "../Model/UserPlayerChatChannel";
import { GetUserPlayerById, UserPlayer, IUserPlayer } from "../../UserPlayer/UserPlayer";
import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { userPlayerChatChannels } from "../ChatSystem";

const redisChat = redis.createClient();

const redisPublisher = redis.createClient();

export function ClientSendGlobalChat(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    chat.chatCode = ChatCode.reciveChat;
    message.data = chat;
    if(chat.content.length == 0) return;
    GetChatChannelById(chat.idChatChannel).then((res : ChatChannel) => {
        redisPublisher.publish(variable.chatSystem, JSON.stringify(message));
        addChatToRedis(JSON.stringify(res._id), JSON.stringify(chat));
    })
}

export function ServerSendGlobalChat(message : IMessage){
    var chat = Chat.Parse(message.data);
    var chatData : string = JSON.stringify(chat);
    message.data = chatData;
    var messageData :string = JSON.stringify(message);
    console.log(`${process.pid} ServerSendGlobalChat ${userPlayerChatChannels.length}`);
    userPlayerChatChannels.forEach(element => {
        if(UserPlayerChatChannel.ExistChatChannel(chat.idChatChannel, element)){
            console.log(`${process.pid} ChatServerSendGMessage to ${element.socket.id}`);
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