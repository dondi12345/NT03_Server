import { Socket } from "socket.io";
import { SocketConfig, variable } from "./Enviroment/Env";

export class TransferData{
    Socket : Socket;
    ResAPI;
    Token : string;

    Send(...data){
        var res ={
            Status : 1,
            Data : data,
        }
        try {
            this.Socket.emit(SocketConfig.Listening, JSON.stringify(res));
        } catch (error) {}
        try {
            this.ResAPI.send(JSON.stringify(res));
        } catch (error) {}
        
    }
}