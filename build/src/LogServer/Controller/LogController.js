"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogServer = exports.LogIdUserPlayer = exports.LogUserSocket = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const LogModel_1 = require("../Model/LogModel");
function LogUserSocket(logCode, userSocket, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    WriteLog(logMode);
}
exports.LogUserSocket = LogUserSocket;
function LogIdUserPlayer(logCode, idUserPlayer, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    WriteLog(logMode);
}
exports.LogIdUserPlayer = LogIdUserPlayer;
function LogServer(logCode, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    WriteLog(logMode);
}
exports.LogServer = LogServer;
function WriteLog(data) {
    var path = "./Log";
    var date = new Date();
    var dateFormat = date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear();
    var fileName = dateFormat + ".log";
    (0, fs_1.writeFile)((0, path_1.join)(path, fileName), JSON.stringify(data) + ",\n", { flag: "a" }, err => { });
}
