"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckVersion = exports.Test = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DataVersion_1 = require("../Model/DataVersion");
const GameData_1 = require("../Model/GameData");
// import { dataVersionDictionary } from "../Service/DataCenterService";
function Test(message, res) {
    res.send("Success");
    console.log("Dev 1689074788 Test");
}
exports.Test = Test;
// export function CheckVersion(message : Message, res){
//     var dataVersion = DataVersion.Parse(message.Data);
//     console.log(GameData[dataVersion.Name]);
//     if(dataVersionDictionary[dataVersion.Name].Version == dataVersion.Version){
//         var messageCallback = new Message();
//         messageCallback.MessageCode = MessageCode.DataCenter_VersionUpToDate;
//         res.send(JSON.stringify(message));
//         console.log("Up to date")
//     }else{
//         var messageCallback = new Message();
//         messageCallback.MessageCode = MessageCode.DataCenter_VersionUpdate;
//         message.Data = JSON.stringify(dataVersionDictionary[dataVersion.Name]);
//         res.send(JSON.stringify(message));
//         console.log("Update")
//     }
// }
function CheckVersion(message, res) {
    var dataVersion = DataVersion_1.DataVersion.Parse(message.Data);
    if (GameData_1.GameData[dataVersion.Name].Version == dataVersion.Version) {
        var messageCallback = new Message_1.Message();
        messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpToDate;
        res.send(JSON.stringify(messageCallback));
        console.log("Up to date");
    }
    else {
        var messageCallback = new Message_1.Message();
        messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpdate;
        messageCallback.Data = JSON.stringify(GameData_1.GameData[dataVersion.Name]);
        res.send(JSON.stringify(messageCallback));
        console.log("Update");
    }
}
exports.CheckVersion = CheckVersion;
