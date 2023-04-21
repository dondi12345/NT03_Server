import { MessageCode } from "../../Message/MessageCode";
import { IMessage } from "../../Message/Model/Message";
import { ChatCode } from "../ChatCode";
import { ClientSendGlobalChat, ServerSendGlobalChat } from "../Controller/ChatController";
import { Chat } from "../Model/Chat";

export function ChatRouter(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    message.data = chat;
    console.log(chat.chatCode);
    if(chat.chatCode == ChatCode.sendChat){
        console.log(`${process.pid} send message ${chat.chatCode}`);
        ClientSendGlobalChat(message);
        return;
    }
    if(chat.chatCode == ChatCode.reciveChat){
        console.log(`${process.pid} recive message ${chat.chatCode}`);
        ServerSendGlobalChat(message);
        return;
    }
}