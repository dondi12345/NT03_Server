export enum LogCode {
    Server_ServerStart = 100,

    MessageServer_Test = 1000,

    AccountServer_Test = 2000,
    AccountServer_CreateNew = 2001,
    AccountServer_RegisterFail = 2002,
    AccountServer_RegisterSuccess = 2003,
    AccountServer_LoginFail = 2004,
    AccountServer_LoginSuccess = 2005,

    UserPlayerServer_Test = 3000,
    UserPlayerServer_SaveFail = 3001,
    UserPlayerServer_UpdateUserPlayer= 3002,
    UserPlayerServer_SaveUserPlayer= 3003,
    UserPlayerServer_SaveFailUserPlayer= 3004,

    Currency_Test = 4000,
    Currency_UpdateFail = 4001,
    Currency_SaveFail = 4002,
    Currency_Update = 4003,

    Hero_Test = 5000,
    Hero_ErrorLoadHeroData = 5001,

    HeroEquip_Test = 6000,

    Res_Test = 7000,
    Res_SaveFail = 7001,

    Shop_Test = 8000,

    HeroTeam_Test = 9000,
    HeroTeam_SelectHeroFail = 9001,
    HeroTeam_UpdateFail = 9002,
    HeroTeam_SaveFail = 9003,
    HeroTeam_RemoveSlotFail = 9004,
    
    TDWave_Test = 10000,
    TDWave_ProtectedSuccess = 10001,
    TDWave_ProtectedFail = 10002,

    DailyLoginReward_Test = 11000,

    DataCenter_Test = 12000,
    DataCenter_InitFail = 12001,
}