// Import necessary modules
import { Server, Socket } from "socket.io";
import {port, url, variable} from "./other/Env";
import redis from 'redis';
import { MessageRouter } from "./Message/Router/MessageRouter";
import { Message } from "./Message/Model/Message";
import Init from "./Service/Init";
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
            console.log("new socket connect");
            listSocket.push(socket);
        
            // receive a message from the client
            socket.on(variable.eventSocketListening, (data) => {
                console.log(data);
                var message = Message.Parse(data);
                message.socketId = socket.id;
                console.log(message);
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

export { AppChild, listSocket };