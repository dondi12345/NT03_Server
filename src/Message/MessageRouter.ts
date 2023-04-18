import { MessageCode } from "./MessageCode";
import { IMessage } from "./Model/Message";
import {Connect} from "./MessageController"

export function router(message : IMessage){
    if(message.messageCode == MessageCode.messageConnect){
        Connect(message);
    }
}