import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";
import { isChatServerUseSocket } from "../../ChatServer/Init/InitChatServer";
import { Chat } from "../../ChatServer/Model/Chat";
import { ChatRouter } from "../../ChatServer/Router/ChatRouter";

export function MessageRawData(data){
    var message = Message.Parse(data);
    MessageRouter(message);
}

export function MessageRouter(message : IMessage){
    if(message.MessageCode == MessageCode.MessageTest){
        console.log("1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageConnect){
        Connect(message);
    }

    if(message.MessageCode == MessageCode.Message_ChatServer){
        if(isChatServerUseSocket) return;
        var chat = Chat.Parse(message.Data);
        console.log("1684600754 "+chat);
        ChatRouter(chat);
    }
}