"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckVersion = exports.Test = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DataVersion_1 = require("../Model/DataVersion");
const DataCenterService_1 = require("../Service/DataCenterService");
function Test(message, res) {
    res.send("Success");
    console.log("Dev 1689074788 Test");
}
exports.Test = Test;
function CheckVersion(message, res) {
    var dataVersion = DataVersion_1.DataVersion.Parse(message.Data);
    if (DataCenterService_1.dataVersionDictionary[dataVersion.Name].Version == dataVersion.Version) {
        var messageCallback = new Message_1.Message();
        messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpToDate;
        messageCallback.Data = JSON.stringify(dataVersion);
        res.send(JSON.stringify(messageCallback));
        console.log("Up to date");
    }
    else {
        var messageCallback = new Message_1.Message();
        messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpdate;
        messageCallback.Data = JSON.stringify(DataCenterService_1.dataVersionDictionary[dataVersion.Name]);
        res.send(JSON.stringify(messageCallback));
        console.log("Update");
    }
}
exports.CheckVersion = CheckVersion;
