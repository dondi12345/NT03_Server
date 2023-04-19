import { MessageCode } from "../MessageCode";
import { IMessage } from "../Model/Message";
import { ChatRouter } from "../../Chat/Router/ChatRouter";

export function MessageRouter(message : IMessage){
    if(message.messageCode == MessageCode.chat){
        ChatRouter(message);
    }
}