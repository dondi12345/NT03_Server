import redis from 'redis';
import { Chat, IChat } from "../Model/Chat";
import { ChatChannel, GetChatChannelById } from '../Model/ChatChannel';
import { GetIdUserPlayerByIdChatChannel, UserChatChannel } from '../Model/UserChatChannel';
import { SendToSocket, SendToSocketById, userSocketChatServer } from '../Service/ChatService';
import { variable } from '../../other1/Env';
import { MSGChatCode } from '../Model/MSGChatCode';
import { Socket } from 'socket.io';
import { IMSGChat, MSGChat } from '../Model/MSGChat';

const redisChat = redis.createClient();

const redisPublisher = redis.createClient();

export function SendChat(msgChat :IMSGChat){
    var chat = Chat.Parse(msgChat.Data);
    console.log("1684569237 Sendchat: " + Chat.ToString(chat))
    if(chat.Content.length == 0) return;
    msgChat.MSGChatCode = MSGChatCode.ReciveMSGChat;
    GetChatChannelById(chat.IdChatChannel).then((res : ChatChannel) => {
        if(res == null || res == undefined) return;
        redisPublisher.publish(variable.chatServer, MSGChat.ToString(msgChat));
        addChatToRedis(JSON.stringify(res._id), Chat.ToString(chat));
    })
}

export function ReciveChat(msgChat :IMSGChat){
    var chat = Chat.Parse(msgChat.Data);
    console.log("1684569247 ReciveChat")
    GetChatChannelById(chat.IdChatChannel).then(res=>{
        console.log("1684569247 Recive "+res)
        var chatChannel = ChatChannel.Parse(res);
        GetIdUserPlayerByIdChatChannel(chatChannel._id).then(res=>{
            if(res.length == 0) return;
            res.forEach(element => {
                SendToSocketById(element.IdUserPlayer.toString(), msgChat);
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