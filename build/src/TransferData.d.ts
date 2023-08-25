import { Socket } from "socket.io";
export declare class TransferData {
    Socket: Socket;
    ResAPI: any;
    Token: string;
    Send(...data: any[]): void;
}
