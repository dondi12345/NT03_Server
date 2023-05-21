import { Server, Socket } from "socket.io";
import {port, variable} from "../../other_1/Env";
import { UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { createClient } from 'redis';
import { Chat, IChat } from "../Model/Chat";
import { ChatRouter } from "../Router/ChatRouter";
import { userSocketMessageServer } from "../../MessageServer/Service/MessageService";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { IMSGChat, MSGChat } from "../Model/MSGChat";

const redisSubscriber = createClient();

export let userSocketChatServer : UserSocketServer;

export let isChatServerUseSocket : boolean;

export function InitChatServer(){
    InitWithSocket();
    // InitWithMessageServer();
    redisSubscriber.subscribe(variable.chatServer);

    redisSubscriber.on('message', (channel, data) => {
        var msgChat = MSGChat.Parse(data);
        console.log("1684603001 Listent "+ JSON.stringify(msgChat));
        ChatRouter(msgChat);
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
            var msgChat = MSGChat.Parse(data);
            console.log("1684564028:" + JSON.stringify(msgChat));
            try {
                userSocketChatServer[msgChat.IdUserPlayer.toString()] = socket;
            } catch (error) {
                console.log("1684642664 "+error);
            }
            msgChat.Socket = socket;
            ChatRouter(msgChat)
        });
    });
}

export function SendToSocket(msgChat : IMSGChat, socket : Socket){
    var msg = MSGChat.ToString(msgChat);

    try {
        socket.emit(variable.eventSocketListening, msg);
    } catch (error) {
        console.log("1684665082 "+error);
    }
}

export function SendToSocketById(idUserPlayer : string, msgChat : IMSGChat){
    try {
        var socket = userSocketChatServer[idUserPlayer].emit(variable.eventSocketListening, MSGChat.ToString(msgChat));
    } catch (error) {
        
    }
}
