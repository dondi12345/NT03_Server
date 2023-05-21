import { Server, Socket } from "socket.io";
import {port, variable} from "../../other/Env";
import { Message } from "../Model/Message";
import { UserSocket, UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { MessageRouter } from "../Router/MessageRouter";
import { createClient } from 'redis';

const redisSubscriber = createClient();

export let userSocketMessageServer : UserSocketServer = {};

export function InitMessageServer(){
    InitWithSocket();
}

function InitWithSocket() {
    const io = new Server(port.portMessageServer);
    console.log(`1684424393 Worker ${process.pid} listening to MessageServer on port: ${port.portMessageServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684424410 Socket connec to MessageServer");
        socket.on(variable.eventSocketListening, (data) => {
            console.log("1684424442:" + data);
            var message = Message.Parse(data);
            try {
                userSocketMessageServer[message.IdUserPlayer.toString()] = socket;
            } catch (error) {
                console.log("1684642567 "+error);
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