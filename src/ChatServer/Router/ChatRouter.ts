import { ReciveChat, SendChat } from "../Controller/ChatController";
import { MSGChatCode } from "../Model/MSGChatCode";
import { IMSGChat } from "../Model/MSGChat";
import { Socket } from "socket.io";

export function ChatRouter(msgChat : IMSGChat, socket : Socket){
    if(msgChat.MSGChatCode == MSGChatCode.TestMSGChat){
        console.log("1684566303 TestChat")
        return;
    }
    if(msgChat.MSGChatCode == MSGChatCode.SendMSGChat){
        SendChat(msgChat);
        return;
    }
}

export function ChatRouterWithoutSocket(msgChat : IMSGChat){
    if(msgChat.MSGChatCode == MSGChatCode.ReciveMSGChat){
        ReciveChat(msgChat);
        return;
    }
}