import { Types } from "mongoose";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { variable } from "../../Other/Env";
import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";

export function Connect(message : IMessage){
    try{
        var messageRes = new Message();
        messageRes.IdUserPlayer = message.IdUserPlayer;
        messageRes.MessageCode = MessageCode.MessageConnectResponse;
        message.Socket?.emit(variable.eventSocketListening, JSON.stringify(messageRes));
    }catch{
        console.log("1684474838 Not found socket");
    }
}