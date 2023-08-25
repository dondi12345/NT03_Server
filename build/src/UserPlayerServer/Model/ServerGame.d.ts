import { ServerGameCode } from "./ServerGameCode";
export interface IServerGame {
    ServerGameCode: ServerGameCode;
}
export declare class ServerGame implements IServerGame {
    ServerGameCode: ServerGameCode;
    static Parse(data: any): IServerGame;
}
