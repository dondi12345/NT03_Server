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
exports.tdWaveController = void 0;
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const UserPlayerController_1 = require("../../UserPlayerServer/Controller/UserPlayerController");
const TDWaveData_1 = require("./TDWaveData");
class TDWaveController {
    ProtectedSuccessCtrl(message, transferData) {
        var message, message;
        return __awaiter(this, void 0, void 0, function* () {
            var userPlayer = yield UserPlayerController_1.userPlayerController.GetUserPlayerCached(transferData.Token);
            if (userPlayer == null || userPlayer == undefined) {
                message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_Disconnect;
                transferData.Send(JSON.stringify(message));
                return;
            }
            //Reward
            LogController_1.logController.LogMessage(LogCode_1.LogCode.TDWave_ProtectedSuccess, "", transferData.Token);
            LogController_1.logController.LogDev("12355334 Dev: ", userPlayer);
            if (userPlayer.Wave == undefined || userPlayer.Wave == null) {
                userPlayer.Wave = 0;
            }
            var reward;
            if (userPlayer.Wave % 5 == 0) {
                reward = {
                    Money: TDWaveData_1.TDWaveReward5Lv.Money + TDWaveData_1.TDWaveRewardGrow5Lv.Money * userPlayer.Wave,
                    Food: TDWaveData_1.TDWaveReward5Lv.Food + TDWaveData_1.TDWaveRewardGrow5Lv.Food * userPlayer.Wave,
                    HeroScroll_White: Math.floor(TDWaveData_1.TDWaveReward5Lv.HeroScroll_White + TDWaveData_1.TDWaveRewardGrow5Lv.HeroScroll_White * userPlayer.Wave),
                    BlueprintHeroEquip_White: Math.floor(TDWaveData_1.TDWaveReward5Lv.BlueprintHeroEquip_White + TDWaveData_1.TDWaveRewardGrow5Lv.BlueprintHeroEquip_White * userPlayer.Wave)
                };
            }
            else {
                reward = {
                    Money: TDWaveData_1.TDWaveRewardLv.Money + TDWaveData_1.TDWaveRewardGrowLv.Money * userPlayer.Wave,
                    Food: TDWaveData_1.TDWaveRewardLv.Food + TDWaveData_1.TDWaveRewardGrowLv.Food * userPlayer.Wave,
                    HeroScroll_White: 0,
                    BlueprintHeroEquip_White: 0,
                };
            }
            //Update
            console.log(userPlayer, reward, userPlayer.Wave % 5 == 0);
            userPlayer = yield UserPlayerController_1.userPlayerController.UserPlayerChangeAdd({ Wave: 1 }, transferData.Token);
            var currency = yield CurrencyController_1.currencyController.AddCurrency(reward, transferData.Token);
            if (currency == null || currency == undefined) {
                exports.tdWaveController.ProtectedFailCtrl(new Message_1.Message(), transferData);
                return;
            }
            var messageUpdateUserPlayer = new Message_1.Message();
            messageUpdateUserPlayer.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_Update;
            messageUpdateUserPlayer.Data = JSON.stringify(userPlayer);
            var messageCurrency = new Message_1.Message();
            messageCurrency.MessageCode = MessageCode_1.MessageCode.Currency_Update;
            messageCurrency.Data = JSON.stringify(currency);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.TDWave_BattleWin;
            message.Data = JSON.stringify(reward);
            transferData.Send(JSON.stringify(messageUpdateUserPlayer), JSON.stringify(messageCurrency), JSON.stringify(message));
        });
    }
    ProtectedFailCtrl(message, transferData) {
        LogController_1.logController.LogMessage(LogCode_1.LogCode.TDWave_ProtectedFail, "", transferData.Token);
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.TDWave_BattleLose;
        transferData.Send(JSON.stringify(message));
    }
}
exports.tdWaveController = new TDWaveController();
