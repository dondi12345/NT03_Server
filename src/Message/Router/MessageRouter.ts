import { MessageCode } from "../MessageCode";
import { IMessage } from "../Model/Message";
import {Connect} from "../Controller/MessageController"
import { ChatRouter } from "../../Chat/Router/ChatRouter";

export function MessageRouter(message : IMessage){
    if(message.messageCode == MessageCode.messageConnect){
        Connect(message);
    }
    if(message.messageCode == MessageCode.chat){
        ChatRouter(message);
    }
}