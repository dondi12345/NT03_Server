export enum MessageCode {
    MessageServer_Test = 1000,
    MessageServer_Connect = 1001,
    MessageConnectResponse = 1002,
    MessageServer_ConnectFail = 1003,
    MessageServer_ConnectSuccess = 1004,
    MessageServer_Disconnect = 1005,

    AccountServer_Test = 2000,
    AccountServer_Register = 2001,
    AccountServer_RegisterFail = 2002,
    AccountServer_RegisterSuccess = 2003,
    AccountServer_Login = 2004,
    AccountServer_LoginFail = 2005,
    AccountServer_LoginSuccess = 2006,
    AccountServer_LoginToken = 2007,

    UserPlayerServer_Test = 3000,
    UserPlayerServer_Login = 3001,
    UserPlayerServer_LoginFail = 3002,
    UserPlayerServer_LoginSuccess = 3003,
    UserPlayerServer_Update = 3004,

    Currency_Test = 4000,
    Currency_Login  = 4001,
    Currency_LoginFail  = 4002,
    Currency_LoginSuccess  = 4003,
    Currency_Update  = 4004,

    Hero_Test = 5000,
    Hero_Login  = 5001,
    Hero_LoginFail  = 5002,
    Hero_LoginSuccess  = 5003,
    Hero_GetSummonResult  = 5004,
    Hero_SendSummonResult  = 5005,
    Hero_Summon  = 5006,
    Hero_SummonFail  = 5007,
    Hero_SummonSuccess  = 5008,
    Hero_HireHero  = 5009,
    Hero_HireHeroSuccess  = 5010,
    Hero_HireHeroFail  = 5011,
    Hero_UpdateHeroes = 5012,
    Hero_UpgradeLv = 5013,
    Hero_UpgradeLvFail = 5014,

    HeroEquip_Test = 6000,
    HeroEquip_Login  = 6001,
    HeroEquip_LoginFail  = 6002,
    HeroEquip_LoginSuccess  = 6003,
    HeroEquip_Craft  = 6004,
    HeroEquip_CraftFail  = 6005,
    HeroEquip_CraftSuccess  = 6006,
    HeroEquip_Wearing  = 6007,
    HeroEquip_Unwearing  = 6008,
    HeroEquip_WearingSuccess  = 6009,
    HeroEquip_WearingFail  = 6010,
    HeroEquip_UnwearingSuccess  = 6011,
    HeroEquip_UnwearingFail  = 6012,
    HeroEquip_UpdateEquips = 6013,
    HeroEquip_UpgradeLv = 6014,
    HeroEquip_UpgradeLvFail = 6015,

    Res_Test = 7000,
    Res_Login = 7001,
    Res_LoginFail = 7002,
    Res_LoginSuccess = 7003,
    Res_Update = 7004,

    Shop_Test = 8000,
    Shop_BuyResByCurrency = 8001,
    Shop_BuySuccess = 8100,
    Shop_BuyFail = 8100,

    HeroTeam_Test = 9000,
    HeroTeam_Login  = 9001,
    HeroTeam_LoginFail  = 9002,
    HeroTeam_LoginSuccess  = 9003,
    HeroTeam_Update  = 9004,
    HeroTeam_SelectHero = 9005,
    HeroTeam_DeselectHero = 9006,

    TDWave_Test = 10000,
    TDWave_ProtectedSuccess = 10001,
    TDWave_ProtectedFail = 10002,
    TDWave_BattleWin = 10003,
    TDWave_BattleLose = 10004,

    DailyLoginReward_Test = 11000,
    DailyLoginReward_Login = 11001,
    DailyLoginReward_LoginSuccess = 11002,
    DailyLoginReward_LoginFail = 11003,
    DailyLoginReward_Check = 11004,
    DailyLoginReward_CheckSuccess = 11005,
    DailyLoginReward_CheckFail = 11006,

    DataCenter_Test = 12000,
    DataCenter_CheckVersion = 12001,
    DataCenter_VersionUpToDate = 12002,
    DataCenter_VersionUpdate = 12003,
}