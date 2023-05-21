import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";
import { isChatServerUseSocket } from "../../ChatServer/Service/ChatService";
import { ChatRouter } from "../../ChatServer/Router/ChatRouter";
import { MSGUserPlayer } from "../../UserPlayerServer/Model/MSGUserPlayer";
import { UserPlayerRouter } from "../../UserPlayerServer/Router/UserPlayerRouter";
import { MSGChat } from "../../ChatServer/Model/MSGChat";

export function MessageRawData(data){
    var message = Message.Parse(data);
    MessageRouter(message);
}

export function MessageRouter(message : IMessage){
    if(message.MessageCode == MessageCode.MessageTest){
        console.log("1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageConnect){
        Connect(message);
    }

    if(message.MessageCode == MessageCode.Message_ChatServer){
        if(isChatServerUseSocket) return;
        var msgChat = MSGChat.Parse(message.Data);
        msgChat.Socket = message.Socket;
        console.log("1684600754 "+msgChat);
        ChatRouter(msgChat);
    }

    if(message.MessageCode == MessageCode.Message_UserPlayer){
        try {
            var msgUserPlayer = MSGUserPlayer.Parse(message.Data);
            msgUserPlayer.Socket = message.Socket;
            UserPlayerRouter(msgUserPlayer);
        } catch (error) {
            console.log("1684641683 "+error);
        }
    }
}