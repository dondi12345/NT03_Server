"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const MessageCode_1 = require("../Model/MessageCode");
const MessageController_1 = require("../Controller/MessageController");
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const UserPlayerController_1 = require("../../UserPlayerServer/Controller/UserPlayerController");
const HeroController_1 = require("../../HeroServer/Controller/HeroController");
const HeroEquipController_1 = require("../../HeroEquip/Controller/HeroEquipController");
const ResController_1 = require("../../Res/Controller/ResController");
const HeroTeamCtrl_1 = require("../../HeroTeam/Controller/HeroTeamCtrl");
const TDWaveController_1 = require("../../TDWave/Controller/TDWaveController");
function MessageRouter(message, userSocket) {
    if (message.MessageCode == MessageCode_1.MessageCode.MessageServer_Test) {
        console.log("Dev 1684475214 Test Message");
    }
    if (message.MessageCode == MessageCode_1.MessageCode.MessageServer_Connect) {
        (0, MessageController_1.Connect)(message, userSocket);
        return;
    }
    if (userSocket.IdAccount == null || userSocket.IdAccount == undefined) {
        console.log("Dev 1684769809 Logout Acount");
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.UserPlayerServer_Login) {
        (0, UserPlayerController_1.UserPlayerLogin)(message, userSocket);
        return;
    }
    if (userSocket.IdUserPlayer == null || userSocket.IdUserPlayer == undefined) {
        console.log("Dev 1685002171 Logout Acount");
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Currency_Login) {
        (0, CurrencyController_1.CurrencyLogin)(message, userSocket);
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Hero_Summon) {
        (0, HeroController_1.Summon)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Hero_GetSummonResult) {
        (0, HeroController_1.GetSummonResult)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Hero_HireHero) {
        (0, HeroController_1.HireHero)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Hero_Login) {
        (0, HeroController_1.HeroLogin)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Hero_UpgradeLv) {
        (0, HeroController_1.HeroUpgradeLvCtrl)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Login) {
        (0, HeroEquipController_1.HeroEquipLogin)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Craft) {
        (0, HeroEquipController_1.CraftEquip)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Wearing) {
        (0, HeroEquipController_1.WearingEquip)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Unwearing) {
        (0, HeroEquipController_1.UnwearingEquip)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_UpgradeLv) {
        (0, HeroEquipController_1.HeroEquipUpgradeLvCtrl)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.Res_Login) {
        (0, ResController_1.ResLogin)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_Login) {
        (0, HeroTeamCtrl_1.HeroTeamLogin)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_SelectHero) {
        (0, HeroTeamCtrl_1.SelectHeroTeamCtrl)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_DeselectHero) {
        (0, HeroTeamCtrl_1.DeselectHeroTeamCtrl)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.TDWave_ProtectedSuccess) {
        (0, TDWaveController_1.ProtectedSuccessCtrl)(message, userSocket);
        return;
    }
    if (message.MessageCode == MessageCode_1.MessageCode.TDWave_ProtectedFail) {
        (0, TDWaveController_1.ProtectedFailCtrl)(message, userSocket);
        return;
    }
}
exports.MessageRouter = MessageRouter;
