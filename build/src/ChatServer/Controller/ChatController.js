"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChatToRedis = exports.ReciveChat = exports.SendChat = void 0;
const redis_1 = __importDefault(require("redis"));
const Chat_1 = require("../Model/Chat");
const ChatChannel_1 = require("../Model/ChatChannel");
const UserChatChannel_1 = require("../Model/UserChatChannel");
const ChatService_1 = require("../Service/ChatService");
const Env_1 = require("../../Enviroment/Env");
const MSGChatCode_1 = require("../Model/MSGChatCode");
const redisChat = redis_1.default.createClient({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
const redisPublisher = redis_1.default.createClient({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
function SendChat(msgChat) {
    var chat = Chat_1.Chat.Parse(msgChat.Data);
    console.log("Dev 1684569237 Sendchat: " + chat);
    if (chat.Content.length == 0)
        return;
    msgChat.MSGChatCode = MSGChatCode_1.MSGChatCode.ReciveMSGChat;
    (0, ChatChannel_1.GetChatChannelById)(chat.IdChatChannel).then((res) => {
        if (res == null || res == undefined)
            return;
        redisPublisher.publish(Env_1.variable.chatServer, msgChat);
        addChatToRedis(JSON.stringify(res._id), JSON.stringify(chat));
    });
}
exports.SendChat = SendChat;
function ReciveChat(msgChat) {
    var chat = Chat_1.Chat.Parse(msgChat.Data);
    console.log("Dev 1684569247 ReciveChat");
    (0, ChatChannel_1.GetChatChannelById)(chat.IdChatChannel).then(res => {
        console.log("Dev 1684569247 Recive " + res);
        var chatChannel = ChatChannel_1.ChatChannel.Parse(res);
        (0, UserChatChannel_1.GetIdUserPlayerByIdChatChannel)(chatChannel._id).then(res => {
            if (res.length == 0)
                return;
            res.forEach(element => {
                (0, ChatService_1.SendToSocketById)(element.IdUserPlayer.toString(), msgChat);
            });
        });
    });
}
exports.ReciveChat = ReciveChat;
function addChatToRedis(IdChatChannel, chat) {
    redisChat.rpush(IdChatChannel, chat, (error, result) => {
        if (error) {
            console.error('1684567920 Failed to add chat message:', error);
        }
        else {
            console.log(`Dev 1684567933 Chat message added ${result}: `, chat);
            // Remove oldest message if we have more than MAX_CHAT
            if (result > Env_1.variable.maxLengthChat) {
                redisChat.ltrim(IdChatChannel, result - Env_1.variable.maxLengthChat, -1, (error, result) => {
                    if (error) {
                        console.error('1684567941 Failed to remove oldest chat message:', error);
                    }
                    else {
                        console.log('1684567949 Oldest chat message removed:', result);
                    }
                });
            }
        }
    });
}
exports.addChatToRedis = addChatToRedis;
