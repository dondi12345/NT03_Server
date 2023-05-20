import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";

export function MessageRawData(data){
    var message = Message.Parse(data);
    MessageRouter(message);
}

export function MessageRouter(message : IMessage){
    if(message.messageCode == MessageCode.messageTest){
        console.log("1684475214 Test Message")
    }
    if(message.messageCode == MessageCode.messageConnect){
        Connect(message);
    }
}