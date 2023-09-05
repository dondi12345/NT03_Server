"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logController = exports.LogFromClient = exports.LogServer = exports.LogIdUserPlayer = exports.LogUserSocket = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const LogCode_1 = require("../Model/LogCode");
const LogModel_1 = require("../Model/LogModel");
const DateUtils_1 = require("../../Utils/DateUtils");
const __1 = require("../../..");
const EnumUtils_1 = require("../../Utils/EnumUtils");
function LogUserSocket(logCode, userSocket, data = "", type = LogModel_1.LogType.Unknow) {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    logMode.Date = DateUtils_1.dateUtils.GetCurrentFomatDate();
    logMode.Time = DateUtils_1.dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}
exports.LogUserSocket = LogUserSocket;
function LogIdUserPlayer(logCode, idUserPlayer, data = "", type = LogModel_1.LogType.Unknow) {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    logMode.Date = DateUtils_1.dateUtils.GetCurrentFomatDate();
    logMode.Time = DateUtils_1.dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}
exports.LogIdUserPlayer = LogIdUserPlayer;
function LogServer(logCode, data = "", type = LogModel_1.LogType.Unknow) {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    logMode.Date = DateUtils_1.dateUtils.GetCurrentFomatDate();
    logMode.Time = DateUtils_1.dateUtils.GetCurrentTimeSpan();
    logMode.Type = type;
    WriteLog(logMode);
}
exports.LogServer = LogServer;
function LogFromClient(log) {
    WriteLog(log);
}
exports.LogFromClient = LogFromClient;
function WriteLog(data) {
    var path = __1.rootDir + "/public/Log";
    var date = new Date();
    var dateFormat = DateUtils_1.dateUtils.GetCurrentDateNumber();
    var fileName = dateFormat + ".log";
    (0, fs_1.writeFile)((0, path_1.join)(path, fileName), JSON.stringify(data) + ",\n", { flag: "a" }, err => { });
}
class LogController {
    LogDev(...str) {
        // console.log(str);
    }
    LogMessage(logCode, data, token) {
        console.log(EnumUtils_1.enumUtils.ToString(LogCode_1.LogCode, logCode), data, token);
    }
    LogWarring(logCode, data, token) {
        console.log(EnumUtils_1.enumUtils.ToString(LogCode_1.LogCode, logCode), data, token);
    }
    LogError(logCode, data, token) {
        console.log(EnumUtils_1.enumUtils.ToString(LogCode_1.LogCode, logCode), data, token);
    }
}
exports.logController = new LogController();
