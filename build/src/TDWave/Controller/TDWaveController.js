"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedFailCtrl = exports.ProtectedSuccessCtrl = void 0;
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const ResController_1 = require("../../Res/Controller/ResController");
const ResCode_1 = require("../../Res/Model/ResCode");
const UserPlayerController_1 = require("../../UserPlayerServer/Controller/UserPlayerController");
const TDWaveData_1 = require("./TDWaveData");
function ProtectedSuccessCtrl(message, userSocket) {
    //Reward
    if (userSocket.UserPlayer.Wave == undefined || userSocket.UserPlayer.Wave == null) {
        userSocket.UserPlayer.Wave = 0;
    }
    if (userSocket.UserPlayer.Wave % 5 == 0) {
        userSocket.Currency.Money += TDWaveData_1.TDWaveRewardLv.Money + TDWaveData_1.TDWaveRewardGrowLv.Money * userSocket.UserPlayer.Wave;
        userSocket.Currency.Food += TDWaveData_1.TDWaveRewardLv.Food + TDWaveData_1.TDWaveRewardGrowLv.Food * userSocket.UserPlayer.Wave;
        (0, CurrencyController_1.UpdateCurrencyCtrl)(userSocket);
    }
    else {
        userSocket.Currency.Money += TDWaveData_1.TDWaveReward5Lv.Money + TDWaveData_1.TDWaveRewardGrow5Lv.Money * userSocket.UserPlayer.Wave;
        userSocket.Currency.Food += TDWaveData_1.TDWaveReward5Lv.Food + TDWaveData_1.TDWaveRewardGrow5Lv.Food * userSocket.UserPlayer.Wave;
        (0, CurrencyController_1.UpdateCurrencyCtrl)(userSocket);
        var heroScroll_White = Math.floor(TDWaveData_1.TDWaveReward5Lv.HeroScroll_White + TDWaveData_1.TDWaveRewardGrow5Lv.HeroScroll_White * userSocket.UserPlayer.Wave);
        var blueprintHeroEquip_White = Math.floor(TDWaveData_1.TDWaveReward5Lv.BlueprintHeroEquip_White + TDWaveData_1.TDWaveRewardGrow5Lv.BlueprintHeroEquip_White * userSocket.UserPlayer.Wave);
        (0, ResController_1.ChangeRes)(ResCode_1.ResCode.HeroScroll_White, heroScroll_White, userSocket);
        (0, ResController_1.ChangeRes)(ResCode_1.ResCode.BlueprintHeroEquip_White, blueprintHeroEquip_White, userSocket);
    }
    //Update
    userSocket.UserPlayer.Wave++;
    (0, UserPlayerController_1.UpdateUserPlayerCtrl)(userSocket);
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.TDWave_BattleWin;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.ProtectedSuccessCtrl = ProtectedSuccessCtrl;
function ProtectedFailCtrl(message, userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.TDWave_BattleLose;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.ProtectedFailCtrl = ProtectedFailCtrl;
