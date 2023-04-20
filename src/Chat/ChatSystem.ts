import { Server, Socket } from "socket.io";
import {port, variable} from "../other/Env";
import redis from 'redis';
import { MessageRouter } from "../Message/Router/MessageRouter";
import { Message } from "../Message/Model/Message";
import Init from "../Service/Init";
import { MessageCode } from "../Message/MessageCode";
import mongoose, { ObjectId } from "mongoose";
import { UserPlayerChatChannel } from "./Model/UserPlayerChatChannel";
import { GetUserPlayerById, UserPlayer, IUserPlayer } from "../UserPlayer/UserPlayer";
import { ChatRouter } from "./Router/ChatRouter";

// Create Redis subscriber client
const redisSubscriber = redis.createClient();
// Create Redis publisher client
const redisPublisher = redis.createClient();

export let userPlayerChatChannels : UserPlayerChatChannel[] = []

export function ChatSystemInit(){
    const io = new Server(port.portChatSystem);
    console.log(`Chat ${process.pid} listening on port: ${port.portChatSystem}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("Socket connec to Chat");
        socket.on(variable.eventSocketListening, (data) => {
            console.log(data);
            var message = Message.Parse(data);
            message.socketId = socket.id;
            if(message.messageCode == MessageCode.messageConnect){
                UserConnectToChat(message.idUser, socket);
                return;
            }
            ChatRouter(message)
        });
        socket.on('disconnect', () => {
            console.log('A client disconnected: ' + socket.id);
            RemovePlayerChatChannel(socket);
        });
    });

    redisSubscriber.subscribe(variable.chatSystem);

    redisSubscriber.on('message', (channel, data) => {
        var message = Message.Parse(data);
        ChatRouter(message);
    });
}

export function UserConnectToChat(idUser : ObjectId, socket : Socket){
    GetUserPlayerById(idUser).then((res : UserPlayer)=>{
        var userPlayerChatChannel = new UserPlayerChatChannel();
        userPlayerChatChannel.socket = socket;
        userPlayerChatChannel.idChatChannels = [];
        try{
            var userPlayer = UserPlayer.Parse(res);
            console.log(JSON.stringify(userPlayer) + `\n`);
            if(userPlayer.idChatGlobal != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGlobal)
            if(userPlayer.idChatGuild != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGuild)
            console.log(JSON.stringify(userPlayerChatChannel.idChatChannels)+ `\n`);
            userPlayerChatChannel.idUser = idUser;
        }catch(err){
            console.log("GetUserPlayerById: \n" + err)
            var idChatGlobal = new mongoose.Schema.Types.ObjectId(variable.idChatGlobal);
            userPlayerChatChannel.idChatChannels.push(idChatGlobal);
            userPlayerChatChannel.idUser = idUser;
        }
        AddUserPlayerChatChannel(userPlayerChatChannel, socket);
    }).catch((err)=>{
        console.log(err);
    })
}

function AddUserPlayerChatChannel(userPlayerChatChannel: UserPlayerChatChannel, socket : Socket){
    userPlayerChatChannels.push(userPlayerChatChannel);
    console.log("New userPlayerChatChannel: "+ userPlayerChatChannels.length);
}

function RemovePlayerChatChannel(socket : Socket){
    var pos = -1;
    for (let index = 0; index < userPlayerChatChannels.length; index++) {
        const element = userPlayerChatChannels[index];
        if(element.socket.id == socket.id){
            pos = index;
            element.socket.disconnect; 
            socket.disconnect;
        }
    }
    if(pos == -1) return;
    userPlayerChatChannels.splice(pos, 1);
}