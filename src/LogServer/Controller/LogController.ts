import { readFileSync, writeFile } from 'fs';
import { join } from 'path';
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { LogCode } from "../Model/LogCode";
import { LogModel, LogType } from "../Model/LogModel";
import { dateUtils } from '../../Utils/DateUtils';
import { rootDir } from '../../..';

export function LogUserSocket(logCode : LogCode, userSocket : UserSocket, data : string = "", type : LogType = LogType.Unknow){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    logMode.Date = dateUtils.GetCurrentFomatDate();
    logMode.Time = dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}
export function LogIdUserPlayer(logCode : LogCode, idUserPlayer : string, data : string = "", type : LogType = LogType.Unknow){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    logMode.Date = dateUtils.GetCurrentFomatDate();
    logMode.Time = dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}

export function LogServer(logCode : LogCode, data : string = "", type : LogType = LogType.Unknow){
    var logMode = new LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    logMode.Date = dateUtils.GetCurrentFomatDate();
    logMode.Time = dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}

export function LogFromClient(log : string){
    WriteLog(log);
}

function WriteLog(data : any){
  var path = rootDir+"/public/Log"
  var date = new Date();
  var dateFormat = dateUtils.GetCurrentDateNumber();
  var fileName = dateFormat+".log"
  writeFile(join(path, fileName), JSON.stringify(data)+",\n", { flag: "a" }, err => {});
}

class LogController{
    LogDev(...str){
        console.log(str);
    }

    LogMessage(logCode : LogCode, data, token : string){
        console.log(logCode, data, token);
    }

    LogWarring(logCode : LogCode, data, token : string){
        console.log(logCode, data, token);
    }

    LogError(logCode : LogCode, data, token : string){
        console.log(logCode, data, token);
    }
}

export const logController = new LogController();