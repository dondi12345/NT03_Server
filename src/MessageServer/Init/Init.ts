import { Server, Socket } from "socket.io";
import {port, variable} from "../../other/Env";
import { Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { UserSocker } from "../../UserSocker/Model/UserSocker";
import { MessageRouter } from "../Router/MessageRouter";
import { createClient } from 'redis';

export let listUserSocket: Record<string, UserSocker> = {};
const redisSubscriber = createClient();

export function InitMessageServer(){
    InitWithSocket();
}

function InitWithSocket() {
    const io = new Server(port.portMessageServer);
    console.log(`1684424393 Worker ${process.pid} listening on port: ${port.portAppChild}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684424410 Socket connec to App");
        socket.on(variable.eventSocketListening, (data) => {
            console.log("1684424442:" + data);
            var message = Message.Parse(data);
            if(message.messageCode == MessageCode.messageConnect){
                listUserSocket
                return;
            }
            MessageRouter(message)
        });
    });

    redisSubscriber.subscribe(variable.worker);

    redisSubscriber.on('message', (channel, data) => {
        var message = Message.Parse(data);
        MessageRouter(message);
    });
}