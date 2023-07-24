"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connect = void 0;
const mongoose_1 = require("mongoose");
const AccountData_1 = require("../../AccountServer/Model/AccountData");
const AccountTocken_1 = require("../../AccountServer/Model/AccountTocken");
const TockenAuthen_1 = require("../../AccountServer/Model/TockenAuthen");
const AuthenController_1 = require("../../AuthenServer/AuthenController");
const Message_1 = require("../Model/Message");
const MessageCode_1 = require("../Model/MessageCode");
const MessageService_1 = require("../Service/MessageService");
function Connect(message, userSocket) {
    var message;
    return __awaiter(this, void 0, void 0, function* () {
        var tockenAuthen = TockenAuthen_1.TockenAuthen.Parse(message.Data);
        var data = (0, AuthenController_1.AuthenVerify)(tockenAuthen.Token);
        if (data == null || data == undefined) {
            (0, MessageService_1.SendMessageToSocket)(ConnectFailMessage("Token authen fail"), userSocket.Socket);
            console.log("Dev 1684937265 wrong token");
            return;
        }
        else {
            var accountData = AccountData_1.AccountData.Parse(data);
            if (accountData.IdDevice != tockenAuthen.IdDevice) {
                console.log("Dev 1684937311 wrong device");
                (0, MessageService_1.SendMessageToSocket)(ConnectFailMessage("Wrong device"), userSocket.Socket);
                return;
            }
            userSocket.IdAccount = new mongoose_1.Types.ObjectId(accountData.IdAccount.toString());
            userSocket.Platform = tockenAuthen.Platform;
            var accountTocken = new AccountTocken_1.AccountTocken();
            accountTocken.Token = tockenAuthen.Token;
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.MessageServer_ConnectSuccess;
            message.Data = JSON.stringify(accountTocken);
            console.log("Dev 1684993827 Token authen success");
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        }
    });
}
exports.Connect = Connect;
function ConnectFailMessage(error) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.MessageServer_ConnectFail;
    message.Data = error;
    return message;
}
