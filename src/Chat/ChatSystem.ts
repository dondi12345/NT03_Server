import { Server, Socket } from "socket.io";
import {port, variable} from "../other/Env";
import redis from 'redis';
import { MessageRouter } from "../Message/Router/MessageRouter";
import { Message } from "../Message/Model/Message";
import Init from "../Service/Init";
import { MessageCode } from "../Message/MessageCode";
import mongoose, { ObjectId } from "mongoose";
import { ConnectToChat } from "../Chat/Controller/ChatController";
// import SocketMessageModel from "./Socket/SocketMessageModel";
// import { router } from "./Socket/SocketRouter";

// Create Redis subscriber client
const redisSubscriber = redis.createClient();
// Create Redis publisher client
const redisPublisher = redis.createClient();

export function ChatSystemInit(){
    const io = new Server(port.portChatSystem);

    Init.Init().then(()=>{
        io.on(variable.eventSocketConnection, (socket : Socket) => {
            socket.on(variable.eventSocketListening, (data) => {
                console.log(data);
                var message = Message.Parse(data);
                message.socketId = socket.id;
                if(message.messageCode == MessageCode.messageConnect){
                    UserConnect(message.idUser, socket);
                }
                MessageRouter(message)
            });
        });
    }).catch(err=>{
        console.log(err);
    })

    redisSubscriber.subscribe(variable.worker);

    redisSubscriber.on('message', (channel, data) => {
        var message = Message.Parse(data);
        MessageRouter(message);
    });
}