import { Server, Socket } from "socket.io";
import { userSocketMessageServer } from "../../MessageServer/Init/InitMessageServer";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { port, variable } from "../../Other/Env";
import { IMSGAccount, MSGAccount } from "../Model/MSGAccount";
import { AccountRouter } from "../Router/AccountRouter";

export let userSocketAccountServer : UserSocketServer;

export function InitAccountServer(){
    InitWithSocket();
}

function InitWithSocket() {
    userSocketAccountServer = {};
    const io = new Server(port.portAccountServer);
    console.log(`1684683705 Worker ${process.pid} listening to AccountServer on port: ${port.portAccountServer}`);
    io.on(variable.eventSocketConnection, (socket : Socket) => {
        console.log("1684683690 Socket connect to AccountServer");
        socket.on(variable.eventSocketListening, (data) => {
            var msgAccount = MSGAccount.Parse(data);
            console.log("1684683710:" + JSON.stringify(msgAccount));
            try {
                userSocketAccountServer[msgAccount.IdAccount.toString()] = socket;
            } catch (error) {
                console.log("1684683715 "+error);
            }
            msgAccount.Socket = socket;
            AccountRouter(msgAccount)
        });
    });
}

export function SendToSocket(msgAccount : IMSGAccount, socket : Socket){
    var msg = MSGAccount.ToString(msgAccount);

    try {
        socket.emit(variable.eventSocketListening, msg);
    } catch (error) {
        console.log("1684665082 "+error);
    }
}

export function SendToSocketById(idAccount : string, msgAccount : MSGAccount){

}