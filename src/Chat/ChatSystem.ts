import { Server, Socket } from "socket.io";
import {port, variable} from "../other/Env";
import redis from 'redis';
import { Message } from "../Message/Model/Message";
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
            RemovePlayerChatChannelBySocket(socket);
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
            if(userPlayer.idChatGlobal != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGlobal)
            if(userPlayer.idChatGuild != null) userPlayerChatChannel.idChatChannels.push(userPlayer.idChatGuild)
            userPlayerChatChannel.idUser = idUser;
        }catch(err){
            var idChatGlobal = new mongoose.Schema.Types.ObjectId(variable.idChatGlobal);
            userPlayerChatChannel.idChatChannels.push(idChatGlobal);
            userPlayerChatChannel.idUser = idUser;
        }
        AddUserPlayerChatChannel(userPlayerChatChannel);
    }).catch((err)=>{
        console.log(err);
    })
}

function AddUserPlayerChatChannel(userPlayerChatChannel: UserPlayerChatChannel){
    RemovePlayerChatChannelByIdUser(userPlayerChatChannel.idUser);
    userPlayerChatChannels.push(userPlayerChatChannel);
}

function RemovePlayerChatChannelBySocket(socket : Socket){
    for (let index = userPlayerChatChannels.length -1; index >=0 ; index--) {
        const element = userPlayerChatChannels[index];
        if(element.socket.id == socket.id){
            userPlayerChatChannels.splice(index, 1);
        }
    }
}
function RemovePlayerChatChannelByIdUser(id : ObjectId){
    for (let index = userPlayerChatChannels.length -1; index >=0 ; index--) {
        const element = userPlayerChatChannels[index];
        if(element.idUser == id){
            userPlayerChatChannels.splice(index, 1);
        }
    }
}