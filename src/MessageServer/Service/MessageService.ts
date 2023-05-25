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
const redisAccountToken = createClient();

export let userSocketMessageServer : UserSocketServer = {};
export let userSocketDictionary : UserSocketDictionary ={};

export function InitMessageServer(){
    redisAccountToken.keys('Account:Token:*', (error, keys) => {
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
              console.log('Keys deleted:', deletedCount);
            }
          });
        } else {
          console.log('No keys found matching the pattern.');
        }
      })
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
            console.log("1685025149 "+socket.id+" left MessageServer");
            try {
                delete userSocketDictionary[userSocket.IdUserPlayer.toString()]
            } catch (error) {
                console.log("1684903275 "+error)
            }
            try {
                redisAccountToken.del("Account:Token:"+userSocket.IdAccount,()=>{});
            } catch (error) {
                
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
        socket.emit(variable.eventSocketListening, JSON.stringify(message));
    } catch (error) {
        console.log("1684765923 "+error);
    }
}