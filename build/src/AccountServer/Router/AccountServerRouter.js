"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountServerRouter = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const AccountController_1 = require("../Controller/AccountController");
function AccountServerRouter(data, transferData) {
    var message = Message_1.Message.Parse(data);
    transferData.Token = message.Token;
    if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Register) {
        AccountController_1.accountController.AccountRegister(message, transferData);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Login) {
        AccountController_1.accountController.AccountLogin(message, transferData);
        return;
    }
}
exports.AccountServerRouter = AccountServerRouter;
