import redis from 'redis';
import { Chat, IChat } from "../Model/Chat";
import { ChatChannel, GetChatChannelById } from '../Model/ChatChannel';
import { GetIdUserPlayerByIdChatChannel, UserChatChannel } from '../Model/UserChatChannel';
import { ChatServerFormatData, userSocketChatServer } from '../Init/InitChatServer';
import { variable } from '../../Other/Env';
import { ChatCode } from '../Model/ChatCode';
import { Socket } from 'socket.io';

const redisChat = redis.createClient();

const redisPublisher = redis.createClient();

export function SendChat(chat :IChat){
    console.log("1684569237 Sendchat: " + Chat.ToString(chat))
    if(chat.Content.length == 0) return;
    chat.ChatCode = ChatCode.ReciveChat;
    GetChatChannelById(chat.IdChatChannel).then((res : ChatChannel) => {
        if(res == null || res == undefined) return;
        redisPublisher.publish(variable.chatServer, Chat.ToString(chat));
        addChatToRedis(JSON.stringify(res._id), Chat.ToString(chat));
    })
}

export function ReciveChat(chat :IChat){
    console.log("1684569247 ReciveChat")
    GetChatChannelById(chat.IdChatChannel).then(res=>{
        console.log("1684569247 Recive "+res)
        var chatChannel = ChatChannel.Parse(res);
        GetIdUserPlayerByIdChatChannel(chatChannel._id).then(res=>{
            if(res.length == 0) return;
            res.forEach(element => {
                var socket = userSocketChatServer[element.IdUserPlayer.toString()];
                if(socket == null|| socket == undefined) return;
                socket.emit(variable.eventSocketListening, ChatServerFormatData(chat));
                console.log("1684599816 "+socket.id)
            });
        })
    })
}

export function addChatToRedis(IdChatChannel :string, chat: string) {
    redisChat.rpush(IdChatChannel, chat, (error, result) => {
        if (error) {
            console.error('1684567920 Failed to add chat message:', error);
        } else {
            console.log(`1684567933 Chat message added ${result}: `, chat);
            // Remove oldest message if we have more than MAX_CHAT
            if (result > variable.maxLengthChat) {
                redisChat.ltrim(IdChatChannel, result - variable.maxLengthChat, -1, (error, result) => {
                    if (error) {
                        console.error('1684567941 Failed to remove oldest chat message:', error);
                    } else {
                        console.log('1684567949 Oldest chat message removed:', result);
                    }
                });
            }
        }
    });
}