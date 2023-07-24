"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModel = exports.LogType = exports.PlatformCode = void 0;
var PlatformCode;
(function (PlatformCode) {
    PlatformCode[PlatformCode["Unknow"] = 0] = "Unknow";
    PlatformCode[PlatformCode["IOS"] = 1] = "IOS";
    PlatformCode[PlatformCode["Android"] = 2] = "Android";
    PlatformCode[PlatformCode["Window"] = 3] = "Window";
})(PlatformCode = exports.PlatformCode || (exports.PlatformCode = {}));
var LogType;
(function (LogType) {
    LogType[LogType["Unknow"] = 0] = "Unknow";
    LogType[LogType["Normal"] = 1] = "Normal";
    LogType[LogType["Warning"] = 2] = "Warning";
    LogType[LogType["Error"] = 3] = "Error";
})(LogType = exports.LogType || (exports.LogType = {}));
class LogModel {
}
exports.LogModel = LogModel;
