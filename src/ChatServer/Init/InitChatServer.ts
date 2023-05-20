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

let isSocket : boolean;

export function InitChatServer(){
    InitWithSocket();

    redisSubscriber.subscribe(variable.chatServer);
    redisSubscriber.on('message', (channel, data) => {
        console.log("1684573787 Subscrib ChatServer: "+channel)
        var chat = Chat.Parse(data);
        ChatRouter(chat);
    });
}

function InitWithSocket() {
    isSocket = true;
    userSocketChatServer = {};
    const io = new Server(port.portChatServer);
    console.log(`1684563910 Worker ${process.pid} listening to ChatServer on port: ${port.portChatServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684563926 Socket connect to ChatServer");
        socket.on(variable.eventSocketListening, (data) => {
            console.log("1684564028:" + data);
            var chat = Chat.Parse(data);
            console.log("1684564034 Save SocketUser: "+ chat.IdUserPlayer.toString()+" _ "+socket.id);
            userSocketChatServer[chat.IdUserPlayer.toString()] = socket;
            chat.socket = socket;
            ChatRouter(chat)
        });
    });
}

function InitWithMessageServer(){
    isSocket = false;
    userSocketChatServer = userSocketMessageServer;
}

export function ChatServerFormatData(chat : IChat){
    if(isSocket) return Chat.ToString(chat);
    var message : Message = new Message();
    message.messageCode = MessageCode.message_ChatServer;
    message.IdUserPlayer = chat.IdUserPlayer;
    message.data = Chat.ToString(chat);
    return JSON.stringify(message);
}