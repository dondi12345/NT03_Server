// Import necessary modules
import { Server, Socket } from "socket.io";
import {port, url, variable} from "./other/Env";
import redis from 'redis';
import { router } from "./Message/MessageRouter";
import { Message } from "./Message/Model/Message";
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

    redisSubscriber.subscribe('worker');

    redisSubscriber.on('message', (channel, data) => {
        // var socketMessage = SocketMessageModel.SocketMessage.Parse(data);
        // router(socketMessage);
});

io.on(variable.eventSocketConnection, (socket) => {
    // send a message to the client
    for (let i = 0; i < 600000; i++) {
    }
    listSocket.push(socket);

    // receive a message from the client
    socket.on(variable.eventSocketListening, (data) => {
        var message : Message = JSON.parse(data);
        router(message)
    });
});
}

export { AppChild, listSocket };