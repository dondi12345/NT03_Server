import { Server, Socket } from "socket.io";
import {port, variable} from "../../Enviroment/Env";
import { Message } from "../Model/Message";
import { UserSocket, UserSocketDictionary, UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { MessageRouter } from "../Router/MessageRouter";
import { createClient } from 'redis';
import { MessageCode } from "../Model/MessageCode";
import { AccountLogin, AccountRegister } from "../../AccountServer/Controller/AccountController";
import { UserPlayerLogin } from "../../UserPlayerServer/Controller/UserPlayerController";

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
        console.log("1684424410 "+socket.id+" connec to MessageServer");
        let userSocket = new UserSocket();
        socket.on(variable.eventSocketListening, (data) => {
            console.log("1684424442:" + data);
            var message = Message.Parse(data);

            if(!userSocket.Socket) userSocket.Socket = socket;

            MessageRouter(message, userSocket);
        });

        socket.on("disconnect", () => {
            try {
                delete userSocketDictionary[userSocket.IdUserPlayer.toString()]
            } catch (error) {
                console.log("1684903275 "+error)
            }
        });
    });

    // redisSubscriber.subscribe(variable.worker);

    // redisSubscriber.on(variable.messageServer, (channel, data) => {
    //     var message = Message.Parse(data);
    //     MessageRouter(message);
    // });
}

export function SendMessageToSocket(message: Message, socket : Socket){
    try {
        socket.emit(variable.eventSocketListening, message);
    } catch (error) {
        console.log("1684765923 "+error);
    }
}