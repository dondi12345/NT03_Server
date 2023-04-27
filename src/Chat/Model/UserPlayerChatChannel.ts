import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";

export interface IUserPlayerChatChannel {
    idUser : Types.ObjectId;
    socket : Socket;
    idChatChannels : Types.ObjectId[];
}

export class UserPlayerChatChannel implements IUserPlayerChatChannel {
    idUser : Types.ObjectId;
    socket : Socket;
    idChatChannels : Types.ObjectId[];

    static ExistChatChannel(id : Types.ObjectId, userPlayerChatChannel : IUserPlayerChatChannel){
        for (let index = 0; index < userPlayerChatChannel.idChatChannels.length; index++) {
            let element = userPlayerChatChannel.idChatChannels[index];
            if(id == element) return true;
        }
        return false;
    }
}
