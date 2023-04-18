import { ConnectToChat } from "../../Chat/Controller/ChatController";
import { IMessage } from "../Model/Message";

export function Connect(message : IMessage){
    console.log("Someone connect to server");
    ConnectToChat(message);
}