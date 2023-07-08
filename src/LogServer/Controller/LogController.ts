import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { LogCode } from "../Model/LogCode";
import { LogModel } from "../Model/LogModel";

export function LogUserSocket(logCode : LogCode, userSocket : UserSocket, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    console.log(JSON.stringify(logMode));
}
export function LogIdUserPlayer(logCode : LogCode, idUserPlayer : string, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    console.log(JSON.stringify(logMode));
}