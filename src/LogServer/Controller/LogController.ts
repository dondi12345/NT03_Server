import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

export let fileName = "log-server.log"

import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { LogCode } from "../Model/LogCode";
import { LogModel } from "../Model/LogModel";

export function LogUserSocket(logCode : LogCode, userSocket : UserSocket, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    console.log(logMode);
    WriteLog(logMode);
}
export function LogIdUserPlayer(logCode : LogCode, idUserPlayer : string, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    console.log(logMode);
    WriteLog(logMode);
}

export function LogServer(logCode : LogCode, data : string = ""){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    console.log(logMode);
    WriteLog(logMode);
}

function WriteLog(data : any){
    writeFile(join(__dirname, fileName), JSON.stringify(data), { flag: "wx" }, err => {
        if (err) {
          console.log("file " + fileName + " already exists, testing next");
          fileName = fileName + "0";
          writeFile();
        }
        else {
          console.log("Succesfully written " + fileName);
        }
      });
      writeFile();
}