import { Server, Socket } from "socket.io";
import {portConfig, Redis, variable} from "../../Enviroment/Env";
import { Message } from "../Model/Message";
import { IUserSocket, UserSocket, UserSocketDictionary, UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { MessageRouter } from "../Router/MessageRouter";
import { createClient } from 'redis';
import { MessageCode } from "../Model/MessageCode";
import { AccountLogin, AccountRegister } from "../../AccountServer/Controller/AccountController";
import { UserPlayerLogin } from "../../UserPlayerServer/Controller/UserPlayerController";
import { AccountData } from "../../AccountServer/Model/AccountData";
import { UserSocketData } from "../../UserSocket/Model/UserSocketData";

const redisSubscriber = createClient({
    host: Redis.Host,
    port: Redis.Port,
    password: Redis.Password,
  });
const redisAccountToken = createClient({
    host: Redis.Host,
    port: Redis.Port,
    password: Redis.Password,
  });
const redisUserPlayerChannelSub = createClient({
    host: Redis.Host,
    port: Redis.Port,
    password: Redis.Password,
  });

export let userSocketDictionary : UserSocketDictionary ={};

export function InitMessageServerWithSocket(){
    redisAccountToken.keys(Redis.KeyUserPlayerSession+'*', (error, keys) => {
        if (error) {
          console.error('Error retrieving keys:', error);
          return;
        }
      
        // If there are keys matching the pattern
        if (keys.length > 0) {
          // Delete the keys
          redisAccountToken.del(...keys, (error, deletedCount) => {
            if (error) {
              console.error('Error deleting keys:', error);
            } else {
              console.log('1685077153 Keys deleted:', deletedCount);
            }
          });
        } else {
          console.log('No keys found matching the pattern.');
        }
      })
    InitWithSocket();
}

function InitWithSocket() {
    const io = new Server(portConfig.portMessageServer);
    console.log(`Dev 1684424393 Worker ${process.pid} listening to MessageServer on port: ${portConfig.portMessageServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("Dev 1684424410 "+socket.id+" connec to MessageServer");
        let userSocket = new UserSocket();
        socket.on(variable.eventSocketListening, (data) => {
            console.log("Dev 1684424442:" + data);
            var message = Message.Parse(data);

            if(!userSocket.Socket) userSocket.Socket = socket;

            MessageRouter(message, userSocket);
        });

        socket.on("disconnect", () => {
            console.log("Dev 1685025149 "+socket.id+" left MessageServer");
            try {
                console.log("Dev 1685086000 ")
                redisAccountToken.del(Redis.KeyUserPlayerSession + userSocket.IdUserPlayer,()=>{});
            } catch (error) {
                console.log("Dev 1685080913 "+error)
            }
            try {
                delete userSocketDictionary[userSocket.IdUserPlayer.toString()]
            } catch (error) {
                console.log("Dev 1684903275 "+error)
            }
        });
    });

    // redisSubscriber.subscribe(variable.worker);

    // redisSubscriber.on(variable.messageServer, (channel, data) => {
    //     var message = Message.Parse(data);
    //     MessageRouter(message);
    // });

    redisUserPlayerChannelSub.subscribe(Redis.UserPlayerChannel);
    redisUserPlayerChannelSub.on('message', (channel, data)=>{
        console.log("Dev 1685078357"+data)
        var message = Message.Parse(data);
        if(message.MessageCode == MessageCode.MessageServer_Disconnect){
            try {
                var userSocketData = UserSocketData.Parse(message.Data);
                console.log("Dev 1685077463 Disconnect: "+userSocketData.IdUserPlayer.toString());
                userSocketDictionary[userSocketData.IdUserPlayer.toString()].Socket.disconnect();
            } catch (error) {
                console.log("Dev 1685074144 "+error)
            }
        }
    });
}

export function AddUserSocketDictionary(userSocket : IUserSocket){
    userSocketDictionary[userSocket.IdUserPlayer.toString()] = userSocket;
}

export function SendMessageToSocket(message: Message, socket : Socket){
    try {
        socket.emit(variable.eventSocketListening, JSON.stringify(message));
    } catch (error) {
        console.log("Dev 1684765923 "+error);
    }
}