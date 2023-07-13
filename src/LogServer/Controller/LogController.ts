import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { LogCode } from "../Model/LogCode";
import { LogModel } from "../Model/LogModel";

export function LogUserSocket(logCode : LogCode, userSocket : UserSocket, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    WriteLog(logMode);
}
export function LogIdUserPlayer(logCode : LogCode, idUserPlayer : string, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    WriteLog(logMode);
}

export function LogServer(logCode : LogCode, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    WriteLog(logMode);
}

function WriteLog(data : any){
  var path = "./Log"
  var date = new Date();
  var dateFormat = date.getUTCDate()+"-"+(date.getUTCMonth()+1)+"-"+date.getUTCFullYear()
  var fileName = dateFormat+".log"
  writeFile(join(path, fileName), JSON.stringify(data)+",\n", { flag: "a" }, err => {});
}