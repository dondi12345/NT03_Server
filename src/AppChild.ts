// Import necessary modules
import { Server, Socket } from "socket.io";
import {port, variable} from "./other/Env";
import redis from 'redis';
import { MessageRouter } from "./Message/Router/MessageRouter";
import { Message } from "./Message/Model/Message";
import Init from "./Service/Init";
import { MessageCode } from "./Message/MessageCode";
import mongoose, { ObjectId } from "mongoose";
// import SocketMessageModel from "./Socket/SocketMessageModel";
// import { router } from "./Socket/SocketRouter";

// Create Redis subscriber client
const redisSubscriber = redis.createClient();
// Create Redis publisher client
const redisPublisher = redis.createClient();

export class UserSocket{
    idUser : ObjectId;
    socket : Socket;
}

export let listUserSocket: UserSocket[] = [];
let workerChannel;
// Function to create app child instance
export function AppChild() {
    const io = new Server(port.portAppChild);
    console.log(`Worker ${process.pid} listening on port: ${port.portAppChild}`);
    workerChannel = `worker${process.pid}`;

    Init.Init().then(()=>{
        io.on(variable.eventSocketConnection, (socket : Socket) => {
            // send a message to the client
            // for (let i = 0; i < 600000; i++) {
            // }
            // receive a message from the client
            socket.on(variable.eventSocketListening, (data) => {
                console.log(data);
                var message = Message.Parse(data);
                if(message.messageCode == MessageCode.messageConnect){
                    AddUserSocket(message.idUser, socket);
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

export function AddUserSocket(idUser : ObjectId, socket : Socket){
    for (let index = 0; index < listUserSocket.length; index++) {
        const element = listUserSocket[index];
        console.log(idUser + ' - ' + element.idUser + ": " + (idUser == element.idUser));
        if(idUser == element.idUser){
            element.socket = socket;
            console.log("Update socket");
            return;
        }
    }
    var newUserSocket = new UserSocket();
    newUserSocket.idUser = idUser;
    newUserSocket.socket = socket;
    listUserSocket.push(newUserSocket);
    console.log("New user socket: "+ listUserSocket.length);
}

export function SendMessage(message : Message, idUser : ObjectId){
    var data : string = JSON.stringify(message.data);
    message.data = data;
    listUserSocket.forEach(element => {
        if(idUser == element.idUser){
            console.log(`${workerChannel} emit to ${element.idUser}: ` + JSON.stringify(message) +`\n`);
            element.socket.emit(variable.eventSocketListening, JSON.stringify(message));
        }
    });
}