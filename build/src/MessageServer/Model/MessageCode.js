"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCode = void 0;
var MessageCode;
(function (MessageCode) {
    MessageCode[MessageCode["MessageServer_Test"] = 1000] = "MessageServer_Test";
    MessageCode[MessageCode["MessageServer_Connect"] = 1001] = "MessageServer_Connect";
    MessageCode[MessageCode["MessageConnectResponse"] = 1002] = "MessageConnectResponse";
    MessageCode[MessageCode["MessageServer_ConnectFail"] = 1003] = "MessageServer_ConnectFail";
    MessageCode[MessageCode["MessageServer_ConnectSuccess"] = 1004] = "MessageServer_ConnectSuccess";
    MessageCode[MessageCode["MessageServer_Disconnect"] = 1005] = "MessageServer_Disconnect";
    MessageCode[MessageCode["AccountServer_Test"] = 2000] = "AccountServer_Test";
    MessageCode[MessageCode["AccountServer_Register"] = 2001] = "AccountServer_Register";
    MessageCode[MessageCode["AccountServer_RegisterFail"] = 2002] = "AccountServer_RegisterFail";
    MessageCode[MessageCode["AccountServer_RegisterSuccess"] = 2003] = "AccountServer_RegisterSuccess";
    MessageCode[MessageCode["AccountServer_Login"] = 2004] = "AccountServer_Login";
    MessageCode[MessageCode["AccountServer_LoginFail"] = 2005] = "AccountServer_LoginFail";
    MessageCode[MessageCode["AccountServer_LoginSuccess"] = 2006] = "AccountServer_LoginSuccess";
    MessageCode[MessageCode["AccountServer_LoginToken"] = 2007] = "AccountServer_LoginToken";
    MessageCode[MessageCode["UserPlayerServer_Test"] = 3000] = "UserPlayerServer_Test";
    MessageCode[MessageCode["UserPlayerServer_Login"] = 3001] = "UserPlayerServer_Login";
    MessageCode[MessageCode["UserPlayerServer_LoginFail"] = 3002] = "UserPlayerServer_LoginFail";
    MessageCode[MessageCode["UserPlayerServer_LoginSuccess"] = 3003] = "UserPlayerServer_LoginSuccess";
    MessageCode[MessageCode["UserPlayerServer_Update"] = 3004] = "UserPlayerServer_Update";
    MessageCode[MessageCode["Currency_Test"] = 4000] = "Currency_Test";
    MessageCode[MessageCode["Currency_Login"] = 4001] = "Currency_Login";
    MessageCode[MessageCode["Currency_LoginFail"] = 4002] = "Currency_LoginFail";
    MessageCode[MessageCode["Currency_LoginSuccess"] = 4003] = "Currency_LoginSuccess";
    MessageCode[MessageCode["Currency_Update"] = 4004] = "Currency_Update";
    MessageCode[MessageCode["Hero_Test"] = 5000] = "Hero_Test";
    MessageCode[MessageCode["Hero_Login"] = 5001] = "Hero_Login";
    MessageCode[MessageCode["Hero_LoginFail"] = 5002] = "Hero_LoginFail";
    MessageCode[MessageCode["Hero_LoginSuccess"] = 5003] = "Hero_LoginSuccess";
    MessageCode[MessageCode["Hero_GetSummonResult"] = 5004] = "Hero_GetSummonResult";
    MessageCode[MessageCode["Hero_SendSummonResult"] = 5005] = "Hero_SendSummonResult";
    MessageCode[MessageCode["Hero_Summon"] = 5006] = "Hero_Summon";
    MessageCode[MessageCode["Hero_SummonFail"] = 5007] = "Hero_SummonFail";
    MessageCode[MessageCode["Hero_SummonSuccess"] = 5008] = "Hero_SummonSuccess";
    MessageCode[MessageCode["Hero_HireHero"] = 5009] = "Hero_HireHero";
    MessageCode[MessageCode["Hero_HireHeroSuccess"] = 5010] = "Hero_HireHeroSuccess";
    MessageCode[MessageCode["Hero_HireHeroFail"] = 5011] = "Hero_HireHeroFail";
    MessageCode[MessageCode["Hero_UpdateHeroes"] = 5012] = "Hero_UpdateHeroes";
    MessageCode[MessageCode["Hero_UpgradeLv"] = 5013] = "Hero_UpgradeLv";
    MessageCode[MessageCode["Hero_UpgradeLvFail"] = 5014] = "Hero_UpgradeLvFail";
    MessageCode[MessageCode["HeroEquip_Test"] = 6000] = "HeroEquip_Test";
    MessageCode[MessageCode["HeroEquip_Login"] = 6001] = "HeroEquip_Login";
    MessageCode[MessageCode["HeroEquip_LoginFail"] = 6002] = "HeroEquip_LoginFail";
    MessageCode[MessageCode["HeroEquip_LoginSuccess"] = 6003] = "HeroEquip_LoginSuccess";
    MessageCode[MessageCode["HeroEquip_Craft"] = 6004] = "HeroEquip_Craft";
    MessageCode[MessageCode["HeroEquip_CraftFail"] = 6005] = "HeroEquip_CraftFail";
    MessageCode[MessageCode["HeroEquip_CraftSuccess"] = 6006] = "HeroEquip_CraftSuccess";
    MessageCode[MessageCode["HeroEquip_Wearing"] = 6007] = "HeroEquip_Wearing";
    MessageCode[MessageCode["HeroEquip_Unwearing"] = 6008] = "HeroEquip_Unwearing";
    MessageCode[MessageCode["HeroEquip_WearingSuccess"] = 6009] = "HeroEquip_WearingSuccess";
    MessageCode[MessageCode["HeroEquip_WearingFail"] = 6010] = "HeroEquip_WearingFail";
    MessageCode[MessageCode["HeroEquip_UnwearingSuccess"] = 6011] = "HeroEquip_UnwearingSuccess";
    MessageCode[MessageCode["HeroEquip_UnwearingFail"] = 6012] = "HeroEquip_UnwearingFail";
    MessageCode[MessageCode["HeroEquip_UpdateEquips"] = 6013] = "HeroEquip_UpdateEquips";
    MessageCode[MessageCode["HeroEquip_UpgradeLv"] = 6014] = "HeroEquip_UpgradeLv";
    MessageCode[MessageCode["HeroEquip_UpgradeLvFail"] = 6015] = "HeroEquip_UpgradeLvFail";
    MessageCode[MessageCode["Res_Test"] = 7000] = "Res_Test";
    MessageCode[MessageCode["Res_Login"] = 7001] = "Res_Login";
    MessageCode[MessageCode["Res_LoginFail"] = 7002] = "Res_LoginFail";
    MessageCode[MessageCode["Res_LoginSuccess"] = 7003] = "Res_LoginSuccess";
    MessageCode[MessageCode["Res_Update"] = 7004] = "Res_Update";
    MessageCode[MessageCode["Shop_Test"] = 8000] = "Shop_Test";
    MessageCode[MessageCode["Shop_BuyResByCurrency"] = 8001] = "Shop_BuyResByCurrency";
    MessageCode[MessageCode["Shop_BuySuccess"] = 8100] = "Shop_BuySuccess";
    MessageCode[MessageCode["Shop_BuyFail"] = 8100] = "Shop_BuyFail";
    MessageCode[MessageCode["HeroTeam_Test"] = 9000] = "HeroTeam_Test";
    MessageCode[MessageCode["HeroTeam_Login"] = 9001] = "HeroTeam_Login";
    MessageCode[MessageCode["HeroTeam_LoginFail"] = 9002] = "HeroTeam_LoginFail";
    MessageCode[MessageCode["HeroTeam_LoginSuccess"] = 9003] = "HeroTeam_LoginSuccess";
    MessageCode[MessageCode["HeroTeam_Update"] = 9004] = "HeroTeam_Update";
    MessageCode[MessageCode["HeroTeam_SelectHero"] = 9005] = "HeroTeam_SelectHero";
    MessageCode[MessageCode["HeroTeam_DeselectHero"] = 9006] = "HeroTeam_DeselectHero";
    MessageCode[MessageCode["TDWave_Test"] = 10000] = "TDWave_Test";
    MessageCode[MessageCode["TDWave_ProtectedSuccess"] = 10001] = "TDWave_ProtectedSuccess";
    MessageCode[MessageCode["TDWave_ProtectedFail"] = 10002] = "TDWave_ProtectedFail";
    MessageCode[MessageCode["TDWave_BattleWin"] = 10003] = "TDWave_BattleWin";
    MessageCode[MessageCode["TDWave_BattleLose"] = 10004] = "TDWave_BattleLose";
    MessageCode[MessageCode["DailyLoginReward_Test"] = 11000] = "DailyLoginReward_Test";
    MessageCode[MessageCode["DailyLoginReward_Login"] = 11001] = "DailyLoginReward_Login";
    MessageCode[MessageCode["DailyLoginReward_LoginSuccess"] = 11002] = "DailyLoginReward_LoginSuccess";
    MessageCode[MessageCode["DailyLoginReward_LoginFail"] = 11003] = "DailyLoginReward_LoginFail";
    MessageCode[MessageCode["DailyLoginReward_Check"] = 11004] = "DailyLoginReward_Check";
    MessageCode[MessageCode["DailyLoginReward_CheckSuccess"] = 11005] = "DailyLoginReward_CheckSuccess";
    MessageCode[MessageCode["DailyLoginReward_CheckFail"] = 11006] = "DailyLoginReward_CheckFail";
    MessageCode[MessageCode["DataCenter_Test"] = 12000] = "DataCenter_Test";
    MessageCode[MessageCode["DataCenter_CheckVersion"] = 12001] = "DataCenter_CheckVersion";
    MessageCode[MessageCode["DataCenter_VersionUpToDate"] = 12002] = "DataCenter_VersionUpToDate";
    MessageCode[MessageCode["DataCenter_VersionUpdate"] = 12003] = "DataCenter_VersionUpdate";
    MessageCode[MessageCode["DataCenter_UpdateVersion"] = 12004] = "DataCenter_UpdateVersion";
})(MessageCode = exports.MessageCode || (exports.MessageCode = {}));
