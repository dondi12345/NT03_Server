import { ReciveChat, SendChat } from "../Controller/ChatController";
import {Chat, IChat } from "../Model/Chat";
import { ChatCode } from "../Model/ChatCode";

export function ChatRouter(chat : IChat){
    var chat : Chat = Chat.Parse(chat);
    if(chat.ChatCode == ChatCode.testChat){
        console.log("1684566303 TestChat")
        return;
    }
    if(chat.ChatCode == ChatCode.sendChat){
        SendChat(chat);
        return;
    }
    if(chat.ChatCode == ChatCode.reciveChat){
        ReciveChat(chat);
        return;
    }
}