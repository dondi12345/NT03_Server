import { ServerGameCode } from "./ServerGameCode";

export interface IServerGame{
    ServerGameCode : ServerGameCode;
}

export class ServerGame implements IServerGame{
    ServerGameCode : ServerGameCode;

    static Parse(data) : IServerGame{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}