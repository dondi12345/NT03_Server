export enum LogCode {
    Server_ServerStart = 100,
    Server_RedisSetSuccess = 101,
    Server_RedisSetFail = 102,

    MessageServer_Test = 1000,
    MessageServer_TokenAuthenFail = 1001,
    MessageServer_WrongDevice = 1002,
    MessageServer_TokenAuthenSuccess = 1003,

    AccountServer_Test = 2000,
    AccountServer_CreateNew = 2001,
    AccountServer_RegisterFail = 2002,
    AccountServer_RegisterSuccess = 2003,
    AccountServer_LoginFail = 2004,
    AccountServer_LoginSuccess = 2005,
    AccountServer_CreateFail = 2006,

    UserPlayerServer_Test = 3000,
    UserPlayerServer_SaveFail = 3001,
    UserPlayerServer_UpdateUserPlayer= 3002,
    UserPlayerServer_SaveUserPlayer= 3003,
    UserPlayerServer_SaveFailUserPlayer= 3004,
    UserPlayerServer_CreateFail= 3005,
    UserPlayerServer_SaveToken = 3006,
    UserPlayerServer_SaveTokenFail = 3007,
    UserPlayerServer_AuthenTokenFail = 3008,
    UserPlayerServer_LoginFail = 3009,
    UserPlayerServer_CheckRedisSessionNone = 3010,
    UserPlayerServer_CheckRedisSessionExist = 3011,
    UserPlayerServer_RedisSaveFail = 3012,
    UserPlayerServer_RedisSaveSuccess = 3013,
    UserPlayerServer_RedisExpireFail = 3014,
    UserPlayerServer_RedisExpireSuccess = 3015,
    UserPlayerServer_RedisCacheUserPlayerSuccess = 3016,
    UserPlayerServer_RedisCacheUserPlayerFail = 3017,
    UserPlayerServer_RedisGetUserPlayerFail = 3018,

    Currency_Test = 4000,
    Currency_UpdateFail = 4001,
    Currency_SaveFail = 4002,
    Currency_Update = 4003,
    Currency_LoginFail = 4004,
    Currency_CreateNewFail = 4005,
    Currency_IncreaseNumberFail = 4006,
    Currency_IncreaseNumber = 4007,
    Currency_LoginSuccess = 4008,
    Currency_NotFoundInDB = 4009,
    Currency_AddSuccess = 4010,
    Currency_AddFail = 4011,

    Hero_Test = 5000,
    Hero_ErrorLoadHeroData = 5001,
    Hero_LoginFail = 5002,
    Hero_LoginSuccess = 5003,
    Hero_DontLoginRes = 5004,
    Hero_DontEnoughHeroScroll = 5005,
    Hero_SummonSuccess = 5006,
    Hero_HireFail = 5007,
    Hero_HireSuccess = 5008,
    Hero_UpdateHero = 5009,
    Hero_SaveHero = 5010,
    Hero_SaveHeroFail = 5011,
    Hero_CreateNew = 5012,
    Hero_CreateFail = 5013,

    HeroEquip_Test = 6000,
    HeroEquip_LoginFail = 6001,
    HeroEquip_LoginSuccess = 6002,
    HeroEquip_CraftEquipSuccess = 6003,
    HeroEquip_CraftEquipFail = 6004,
    HeroEquip_ChangeResFail = 6005,
    HeroEquip_ChangeResError = 6006,
    HeroEquip_CreateNewFail = 6007,
    HeroEquip_SaveFail = 6008,
    HeroEquip_InitFail = 6009,
    HeroEquip_UnequipFail = 6010,
    HeroEquip_EquipFail = 6011,

    Res_Test = 7000,
    Res_SaveFail = 7001,
    Res_LoginFail = 7002,
    Res_LoginSuccess = 7003,
    Res_CreateNewFail = 7003,
    Res_Update = 7004,
    Res_UpdateFail = 7005,

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
    DataCenter_NotFoundInDB = 12002,
}