import { Types } from "mongoose";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { variable } from "../../other/Env";
import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";

export function Connect(message : IMessage){
    try{
        var messageRes = new Message();
        messageRes.IdUserPlayer = message.IdUserPlayer;
        messageRes.messageCode = MessageCode.messageConnectResponse;
        message.socket?.emit(variable.eventSocketListening, JSON.stringify(messageRes));
    }catch{
        console.log("1684474838 Not found socket");
    }
}