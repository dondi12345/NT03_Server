"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiServerRouter = void 0;
const AccountController_1 = require("../../AccountServer/Controller/AccountController");
const DataCenterController_1 = require("../../DataCenter/Controller/DataCenterController");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageRouter_1 = require("../../MessageServer/Router/MessageRouter");
class APIServerRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Register) {
            AccountController_1.accountController.AccountRegister(message, transferData);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Login) {
            AccountController_1.accountController.AccountLogin(message, transferData);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.DataCenter_CheckVersion) {
            DataCenterController_1.dataCenterController.CheckVersion(message, transferData);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.DataCenter_UpdateVersion) {
            DataCenterController_1.dataCenterController.ReloadData(message, transferData);
            return;
        }
        MessageRouter_1.messageRouter.Router(message, transferData);
    }
}
exports.apiServerRouter = new APIServerRouter();
