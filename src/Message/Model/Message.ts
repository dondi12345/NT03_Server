import { MessageCode } from "../MessageCode";

export interface IMessage{
    messageCode : MessageCode;
    socketId : string;
    idUser : string,
    data : string;
}

export class Message implements IMessage {
    messageCode: MessageCode;
    socketId: string;
    idUser: string;
    data: string;

    constructor() {
        
    }

    static Parse(data){

    }
}