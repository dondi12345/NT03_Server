import { ConnectToChat } from "../../Chat/Controller/ChatController";
import { IMessage } from "../Model/Message";

export function Connect(message : IMessage){
    ConnectToChat(message);
    console.log("Some one Connect: \n" + JSON.stringify(message));
}