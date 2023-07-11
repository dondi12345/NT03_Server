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
exports.UpdateCurrencyCtrl = exports.CurrencyLogin = void 0;
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const Currency_1 = require("../Model/Currency");
function CurrencyLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, Currency_1.FindCurrencyByIdUserPlayer)(userSocket.IdUserPlayer).then((respone) => __awaiter(this, void 0, void 0, function* () {
            if (respone == null || respone == undefined) {
                var currency = new Currency_1.Currency();
                currency.IdUserPlayer = userSocket.IdUserPlayer;
                yield (0, Currency_1.CreateUserPlayerCurrency)(currency).then(respone => {
                    console.log("Dev 1684837963 " + respone);
                    userSocket.Currency = respone;
                    (0, MessageService_1.SendMessageToSocket)(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
                }).catch(() => {
                    LoginFail(userSocket);
                });
            }
            else {
                console.log("Dev 1684837891 " + respone);
                userSocket.Currency = respone;
                (0, MessageService_1.SendMessageToSocket)(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
            }
        })).catch(() => {
            LoginFail(userSocket);
        });
    });
}
exports.CurrencyLogin = CurrencyLogin;
function LoginFail(userSocket) {
    (0, MessageService_1.SendMessageToSocket)(LoginFailMessage(), userSocket.Socket);
}
function LoginFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Currency_LoginFail;
    return message;
}
function LoginSuccessMessage(res) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Currency_LoginSuccess;
    message.Data = JSON.stringify(res);
    return message;
}
function UpdateCurrencyCtrl(userSocket) {
    try {
        (0, Currency_1.UpdateCurrency)(userSocket.Currency, userSocket.IdUserPlayer);
        var messageBack = new Message_1.Message();
        messageBack.MessageCode = MessageCode_1.MessageCode.Currency_Update;
        messageBack.Data = JSON.stringify(userSocket.Currency);
        (0, MessageService_1.SendMessageToSocket)(messageBack, userSocket.Socket);
    }
    catch (error) {
        (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.Currency_UpdateFail, userSocket, error);
    }
}
exports.UpdateCurrencyCtrl = UpdateCurrencyCtrl;
