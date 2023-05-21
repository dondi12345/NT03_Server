import { Socket } from "socket.io";
import { userSocketMessageServer } from "../../MessageServer/Init/InitMessageServer";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { UserSocketServer } from "../../UserSocket/Model/UserSocket";
import { variable } from "../../other/Env";
import { IMSGUserPlayer, MSGUserPlayer } from "../Model/MSGUserPlayer";

export let userSocketUserPlayerServer : UserSocketServer;

var isUserPlayerServerUseSocket : boolean;

export function InitUserPlayerServer(){
    InitWithMessageServer();
}

function InitWithMessageServer(){
    isUserPlayerServerUseSocket = false;
    userSocketUserPlayerServer = userSocketMessageServer;
}

export function SendToSocket(msgUserPlayer : IMSGUserPlayer, socket : Socket){
    var msg

    if(isUserPlayerServerUseSocket){
        msg = MSGUserPlayer.ToString(msgUserPlayer);
    }else{
        msg = UserPlayerServerFormatToMessageServer(msgUserPlayer);
    }
    
    try {
        socket.emit(variable.eventSocketListening, msg);
    } catch (error) {
        console.log("1684665082 "+error);
    }
}

export function SendToSocketById(idUserPlayer : string, msgUserPlayer : MSGUserPlayer){

}

function UserPlayerServerFormatToMessageServer(msgUserPlayer : IMSGUserPlayer){
    var message : Message = new Message();
    message.MessageCode = MessageCode.Message_UserPlayer;
    if(msgUserPlayer.IdUserPlayer)
        message.IdUserPlayer = msgUserPlayer.IdUserPlayer;
    message.Data = MSGUserPlayer.ToString(msgUserPlayer);
    return JSON.stringify(message);
}