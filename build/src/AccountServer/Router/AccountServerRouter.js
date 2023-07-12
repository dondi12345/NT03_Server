"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountServerRouter = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const AccountController_1 = require("../Controller/AccountController");
function AccountServerRouter(data, res) {
    var message = Message_1.Message.Parse(data);
    if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Register) {
        (0, AccountController_1.AccountRegister)(message, res);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Login) {
        (0, AccountController_1.AccountLogin)(message, res);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_LoginToken) {
        (0, AccountController_1.AccountLoginTocken)(message, res);
        return;
    }
}
exports.AccountServerRouter = AccountServerRouter;
