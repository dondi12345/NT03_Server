import { MessageCode } from "../../Message/MessageCode";
import { IMessage } from "../../Message/Model/Message";
import { ChatCode } from "../ChatCode";
import { ClientSendGlobalChat, ServerSendGlobalChat } from "../Controller/ChatController";
import { Chat } from "../Model/Chat";

export function ChatRouter(message : IMessage){
    var chat : Chat = Chat.Parse(message.data);
    message.data = chat;
    if(chat.chatCode == ChatCode.sendGlobal){
        ClientSendGlobalChat(message);
    }
    if(chat.chatCode == ChatCode.reciveGlobal){
        ServerSendGlobalChat(message);
    }
}