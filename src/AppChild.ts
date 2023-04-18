// Import necessary modules
import { Server, Socket } from "socket.io";
import {port, url, variable} from "./other/Env";
import redis from 'redis';
import { MessageRouter } from "./Message/Router/MessageRouter";
import { Message } from "./Message/Model/Message";
import Init from "./Service/Init";
import { MessageCode } from "./Message/MessageCode";
// import SocketMessageModel from "./Socket/SocketMessageModel";
// import { router } from "./Socket/SocketRouter";

// Create Redis subscriber client
const redisSubscriber = redis.createClient();
// Create Redis publisher client
const redisPublisher = redis.createClient();

let listSocket: Socket[] = [];

// Function to create app child instance
function AppChild() {
    const io = new Server(port.portAppChild);
    console.log(`Worker ${process.pid} listening on port: ${port.portAppChild}`);
    const workerChannel = `worker${process.pid}`;

    Init.Init().then(()=>{
        io.on(variable.eventSocketConnection, (socket : Socket) => {
            // send a message to the client
            for (let i = 0; i < 600000; i++) {
            }
            
            // receive a message from the client
            socket.on(variable.eventSocketListening, (data) => {
                var message = Message.Parse(data);
                if(message.messageCode == MessageCode.messageConnect){
                    listSocket.push(socket);
                }
                message.socketId = socket.id;
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

export function SendMessage(message : Message, socketId){
    listSocket.forEach(element => {
        if(socketId == element.id){
            console.log(`${socketId} emit: ${element.id}` + JSON.stringify(message));
            element.emit(variable.eventSocketListening, JSON.stringify(message));
        }
    });
}

export { AppChild, listSocket };