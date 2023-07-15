"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCenterRouter = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DataCenterController_1 = require("../Controller/DataCenterController");
const DataCenterService_1 = require("../Service/DataCenterService");
function DataCenterRouter(data, res) {
    var message = Message_1.Message.Parse(data);
    if (message.MessageCode == MessageCode_1.MessageCode.DataCenter_Test) {
        (0, DataCenterController_1.Test)(message, res);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.DataCenter_CheckVersion) {
        (0, DataCenterController_1.CheckVersion)(message, res);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.DataCenter_UpdateVersion) {
        (0, DataCenterService_1.InitDataVersion)();
    }
    // if(message.MessageCode == MessageCode.AccountServer_Login){
    //     AccountLogin(message, res)
    //     return;
    // }
    // if(message.MessageCode == MessageCode.AccountServer_LoginToken){
    //     AccountLoginTocken(message, res);
    //     return;
    // }
}
exports.DataCenterRouter = DataCenterRouter;
