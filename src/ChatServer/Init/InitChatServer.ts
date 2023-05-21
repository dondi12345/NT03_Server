import { Server, Socket } from "socket.io";
import {port, variable} from "../../other/Env";
import { UserSocket, UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { createClient } from 'redis';
import { Chat, IChat } from "../Model/Chat";
import { ChatRouter } from "../Router/ChatRouter";
import { userSocketMessageServer } from "../../MessageServer/Init/InitMessageServer";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";

const redisSubscriber = createClient();

export let userSocketChatServer : UserSocketServer;

export let isChatServerUseSocket : boolean;

export function InitChatServer(){
    InitWithSocket();
    // InitWithMessageServer();
    redisSubscriber.subscribe(variable.chatServer);

    redisSubscriber.on('message', (channel, data) => {
        var chat = Chat.Parse(data);
        console.log("1684603001 Listent "+ JSON.stringify(chat));
        ChatRouter(chat);
    });
}

function InitWithSocket() {
    isChatServerUseSocket = true;
    userSocketChatServer = {};
    const io = new Server(port.portChatServer);
    console.log(`1684563910 Worker ${process.pid} listening to ChatServer on port: ${port.portChatServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684563926 Socket connect to ChatServer");
        socket.on(variable.eventSocketListening, (data) => {
            var chat = Chat.Parse(data);
            console.log("1684564028:" + JSON.stringify(chat));
            try {
                userSocketChatServer[chat.IdUserPlayer.toString()] = socket;
            } catch (error) {
                console.log("1684642664 "+error);
            }
            chat.Socket = socket;
            ChatRouter(chat)
        });
    });
}

function InitWithMessageServer(){
    isChatServerUseSocket = false;
    userSocketChatServer = userSocketMessageServer;
}

export function ChatServerFormatData(chat : IChat){
    if(isChatServerUseSocket) return Chat.ToString(chat);
    var message : Message = new Message();
    message.MessageCode = MessageCode.Message_ChatServer;
    message.IdUserPlayer = chat.IdUserPlayer;
    message.Data = Chat.ToString(chat);
    return JSON.stringify(message);
}