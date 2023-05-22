import { Server, Socket } from "socket.io";
import {port, variable} from "../../Other/Env";
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
        console.log("1684424410 Socket connec to MessageServer");
        let userSocket = new UserSocket();
        socket.on(variable.eventSocketListening, (data) => {
            console.log("1684424442:" + data);
            var message = Message.Parse(data);

            if(!userSocket.Socket) userSocket.Socket = socket;

            if(message.MessageCode == MessageCode.AccountServer_Register){
                AccountRegister(message, userSocket);
                return;
            }
            if(message.MessageCode == MessageCode.AccountServer_Login){
                AccountLogin(message, userSocket);
                return;
            }
            if(userSocket.IdAccount == null || userSocket.IdAccount == undefined){
                console.log("1684769809 Logout Acount")
                return;
            }
            if(message.MessageCode == MessageCode.UserPlayerServer_Login){
                UserPlayerLogin(message, userSocket);
                return;
            }
            if(userSocket.IdUserPlayer == null || userSocket.IdUserPlayer == undefined){
                console.log("1684769809 Logout Acount")
                return;
            } 
            MessageRouter(message)
        });

        socket.on("disconnect", () => {
            delete userSocketDictionary[userSocket.IdUserPlayer.toString()]
        });
    });

    redisSubscriber.subscribe(variable.worker);

    redisSubscriber.on(variable.messageServer, (channel, data) => {
        var message = Message.Parse(data);
        MessageRouter(message);
    });
}

export function SendMessageToSocket(message: Message, socket : Socket){
    try {
        socket.emit(variable.eventSocketListening, Message.ToString(message));
    } catch (error) {
        console.log("1684765923 "+error);
    }
}