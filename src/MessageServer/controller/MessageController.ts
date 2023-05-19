import { Types } from "mongoose";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { variable } from "../../other/Env";
import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";

type UserSockets = Record<string, UserSocket>;
let userSocket : UserSocket;

export function Connect(message : IMessage){
    try{
        userSocket[message.idUser.toString()] = message.socket;
        var messageRes = new Message();
        messageRes.idUser = message.idUser;
        messageRes.messageCode = MessageCode.messageConnectResponse;
        message.socket?.emit(variable.eventSocketListening, JSON.stringify(messageRes));
    }catch{
        console.log("1684474838 Not found socket");
    }
}