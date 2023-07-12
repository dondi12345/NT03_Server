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
exports.DailyLoginRewardCheck = exports.DailyLoginRewardLogin = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DailyLoginReward_1 = require("../Model/DailyLoginReward");
function DailyLoginRewardLogin(message, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = DailyLoginReward_1.DailyLoginReward.Parse(message.Data);
        (0, DailyLoginReward_1.FindDailyLoginRewardByIdUser)(data.IdUser).then(res => {
            console.log("Dev 1688972225 ", res);
            if (res == undefined || res == null) {
                var dailyLoginReward = new DailyLoginReward_1.DailyLoginReward();
                dailyLoginReward.IdUser = data.IdUser;
                (0, DailyLoginReward_1.CreateDailyLoginReward)(dailyLoginReward);
                var message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.DailyLoginReward_LoginFail;
                message.Data = JSON.stringify(dailyLoginReward);
                response.send(JSON.stringify(message));
            }
            else {
                var message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.DailyLoginReward_LoginSuccess;
                message.Data = JSON.stringify(res);
                response.send(JSON.stringify(message));
            }
        });
    });
}
exports.DailyLoginRewardLogin = DailyLoginRewardLogin;
function DailyLoginRewardCheck(message, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = DailyLoginReward_1.DailyLoginReward.Parse(message.Data);
        (0, DailyLoginReward_1.FindDailyLoginRewardByIdUser)(data.IdUser).then((res) => {
            console.log("Dev 1688974013 ", res);
            if (res == undefined || res == null) {
                var dailyLoginReward = new DailyLoginReward_1.DailyLoginReward();
                dailyLoginReward.IdUser = data.IdUser;
                (0, DailyLoginReward_1.CreateDailyLoginReward)(dailyLoginReward);
                response.send(JSON.stringify(Message_DailyLoginReward_CheckFail(dailyLoginReward)));
            }
            else {
                var date = new Date();
                var isCheck = false;
                if (date.getUTCFullYear() > res.Year) {
                    isCheck = true;
                }
                if (date.getUTCMonth() + 1 > res.Month) {
                    isCheck = true;
                }
                if (date.getUTCDate() > res.Day) {
                    isCheck = true;
                }
                if (isCheck) {
                    res.Year = date.getUTCFullYear();
                    res.Month = date.getUTCMonth() + 1;
                    res.Day = date.getUTCDate();
                    res.Number++;
                    (0, DailyLoginReward_1.UpdateDailyLoginReward)(res);
                    response.send(JSON.stringify(Message_DailyLoginReward_CheckSuccess(res)));
                }
                else {
                    response.send(JSON.stringify(Message_DailyLoginReward_CheckFail(res)));
                }
            }
        });
    });
}
exports.DailyLoginRewardCheck = DailyLoginRewardCheck;
function Message_DailyLoginReward_CheckFail(dailyLoginReward) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.DailyLoginReward_CheckFail;
    message.Data = JSON.stringify(dailyLoginReward);
    return message;
}
function Message_DailyLoginReward_CheckSuccess(dailyLoginReward) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.DailyLoginReward_CheckSuccess;
    message.Data = JSON.stringify(dailyLoginReward);
    return message;
}
