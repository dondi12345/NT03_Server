import mongoose, { Schema, ObjectId } from 'mongoose';
import { Socket } from "socket.io";

export interface IUserPlayerChatChannel {
    idUser : ObjectId;
    socket : Socket;
    idChatChannels : ObjectId[];
}

export class UserPlayerChatChannel implements IUserPlayerChatChannel {
    idUser : ObjectId;
    socket : Socket;
    idChatChannels : ObjectId[];

    static ExistChatChannel(id : ObjectId, userPlayerChatChannel : IUserPlayerChatChannel){
        for (let index = 0; index < userPlayerChatChannel.idChatChannels.length; index++) {
            let element = userPlayerChatChannel.idChatChannels[index];
            if(id == element) return true;
        }
        return false;
    }
}
