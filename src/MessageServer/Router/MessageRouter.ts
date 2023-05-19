import { IMessage, Message } from "../model/Message";
import { MessageCode } from "../model/MessageCode";
import { Connect } from "../controller/MessageController";

export function MessageRawData(data){
    var message = Message.Parse(data);
    MessageRouter(message);
}

export function MessageRouter(message : IMessage){
    if(message.messageCode == MessageCode.messageTest){
        console.log("1684475214 Test")
    }
    if(message.messageCode == MessageCode.messageConnect){
        Connect(message);
    }
}