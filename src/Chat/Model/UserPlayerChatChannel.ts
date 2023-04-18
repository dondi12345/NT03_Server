import mongoose, { Schema, ObjectId } from 'mongoose';

export interface IUserPlayerChatChannel {
    socketId: string;
    idUser : ObjectId;
    idChatChannels : ObjectId[];
}

export class UserPlayerChatChannel implements IUserPlayerChatChannel {
    socketId: string;
    idUser : ObjectId;
    idChatChannels : ObjectId[];

    static ExistChatChannel(id : ObjectId, userPlayerChatChannel : IUserPlayerChatChannel){
        for (let index = 0; index < userPlayerChatChannel.idChatChannels.length; index++) {
            let element = userPlayerChatChannel.idChatChannels[index];
            if(id == element) return true;
        }
        return false;
    }
}
