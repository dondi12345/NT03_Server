import { Server, Socket } from "socket.io";
import {port, variable} from "../../Other/Env";
import { Message } from "../Model/Message";
import { UserSocket, UserSocketDictionary, UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { MessageRouter } from "../Router/MessageRouter";
import { createClient } from 'redis';
import { MessageCode } from "../Model/MessageCode";

const redisSubscriber = createClient();

export let userSocketMessageServer : UserSocketServer = {};
export let userSocketDictionary : UserSocketDictionary ={};

export function InitMessageServer(){
    InitWithSocket();
}

function InitWithSocket() {
    const io = new Server(port.portMessageServer);
    console.log(`1684424393 Worker ${process.pid} listening to MessageServer on port: ${port.portMessageServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684424410 Socket connec to MessageServer");
        socket.on(variable.eventSocketListening, (data) => {
            let userSocket = new UserSocket();
            console.log("1684424442:" + data);
            var message = Message.Parse(data);
            if(message.MessageCode == MessageCode.AccountServer_Login){
            }
            message.Socket = socket;
            MessageRouter(message)
        });
    });

    redisSubscriber.subscribe(variable.worker);

    redisSubscriber.on(variable.messageServer, (channel, data) => {
        var message = Message.Parse(data);
        MessageRouter(message);
    });
}