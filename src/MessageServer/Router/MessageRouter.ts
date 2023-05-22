import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";


export function MessageRouter(message : IMessage){
    if(message.MessageCode == MessageCode.MessageTest){
        console.log("1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageConnect){
        Connect(message);
    }

    
}