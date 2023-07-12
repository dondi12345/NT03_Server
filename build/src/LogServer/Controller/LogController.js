"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogServer = exports.LogIdUserPlayer = exports.LogUserSocket = void 0;
const LogModel_1 = require("../Model/LogModel");
function LogUserSocket(logCode, userSocket, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = userSocket.Platform;
    logMode.IdUserPlayer = userSocket.IdUserPlayer.toString();
    logMode.Data = data;
    console.log(JSON.stringify(logMode));
}
exports.LogUserSocket = LogUserSocket;
function LogIdUserPlayer(logCode, idUserPlayer, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = idUserPlayer;
    logMode.Data = data;
    console.log(JSON.stringify(logMode));
}
exports.LogIdUserPlayer = LogIdUserPlayer;
function LogServer(logCode, data = "") {
    var logMode = new LogModel_1.LogModel();
    logMode.Code = logCode;
    logMode.Platform = 0;
    logMode.IdUserPlayer = "Server";
    logMode.Data = data;
    console.log(JSON.stringify(logMode));
}
exports.LogServer = LogServer;
