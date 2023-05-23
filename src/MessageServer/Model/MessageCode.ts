export enum MessageCode {
    MessageTest = 1000,
    MessageConnect = 1001,
    MessageConnectResponse = 1002,

    AccountServer_Register = 2001,
    AccountServer_RegisterFail = 2002,
    AccountServer_RegisterSuccess = 2003,
    AccountServer_Login = 2004,
    AccountServer_LoginFail = 2005,
    AccountServer_LoginSuccess= 2006,

    UserPlayerServer_Login = 3001,
    UserPlayerServer_LoginFail = 3002,
    UserPlayerServer_LoginSuccess= 3003,

    Res_Login = 4001,
    Res_LoginFail = 4002,
    Res_LoginSuccess= 4003,
    Res_GainRes = 4004,
}