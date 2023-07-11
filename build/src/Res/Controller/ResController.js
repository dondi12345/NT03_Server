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
exports.UpdateResCtrl = exports.CreateNewRes = exports.ChangeRes = exports.ResLogin = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const Res_1 = require("../Model/Res");
const ResCode_1 = require("../Model/ResCode");
function ResLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, Res_1.FindResByIdUserPlayer)(userSocket.IdUserPlayer).then((respone) => __awaiter(this, void 0, void 0, function* () {
            var reses = new Res_1.Reses();
            for (let item of respone) {
                var res = Res_1.Res.Parse(item);
                console.log("Dev 1686238820 " + JSON.stringify(item));
                reses.Elements.push(res);
            }
            console.log("Dev 1685293709 " + respone.length);
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Res_LoginSuccess;
            message.Data = JSON.stringify(reses);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        })).catch(e => {
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Res_LoginFail;
            message.Data = "Item login fail";
            console.log("Dev 1685293337 " + e);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        });
    });
}
exports.ResLogin = ResLogin;
function ChangeRes(code, number, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1686239535 MinusRes");
        var res;
        yield (0, Res_1.FindItemByIdUserPlayerAndCode)(userSocket.IdUserPlayer, code).then(respone => {
            res = respone;
        });
        if (res == null || res == undefined) {
            yield CreateNewRes(code, userSocket).then(respone => {
                console.log("Dev 1686240263 " + respone);
                res = Res_1.Res.Parse(respone);
            }).catch(e => {
                console.log("Dev 1686239001 " + e);
            });
        }
        if (res == null || res == undefined)
            return false;
        if (res.Code == ResCode_1.ResCode.Unknown)
            return false;
        if (res.Number + number <= 0)
            return false;
        res.Number += number;
        var result = true;
        console.log("Dev 1686728016 ", res);
        // IncreaseNumber(res._id, number);
        UpdateResCtrl(res, userSocket);
        return result;
    });
}
exports.ChangeRes = ChangeRes;
function CreateNewRes(resCode, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = new Res_1.Res(resCode, userSocket.IdUserPlayer, 0);
        console.log("Dev 1686725503 " + res);
        var resback = new Res_1.Res(ResCode_1.ResCode.Unknown, userSocket.IdUserPlayer, 0);
        yield (0, Res_1.CreateRes)(res).then(respone => {
            resback = Res_1.Res.Parse(respone);
        }).catch(e => {
            console.log("Dev 1686240493 " + e);
        });
        return resback;
    });
}
exports.CreateNewRes = CreateNewRes;
function UpdateResCtrl(res, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, Res_1.UpdateRes)(res);
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.Res_Update;
        message.Data = JSON.stringify(res);
        (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
    });
}
exports.UpdateResCtrl = UpdateResCtrl;
