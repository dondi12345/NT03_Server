export enum MessageCode {
    MessageServer_Test = 1000,
    MessageServer_Connect = 1001,
    MessageConnectResponse = 1002,
    MessageServer_ConnectFail = 1003,
    MessageServer_ConnectSuccess = 1004,
    MessageServer_Disconnect = 1005,


    AccountServer_Register = 2001,
    AccountServer_RegisterFail = 2002,
    AccountServer_RegisterSuccess = 2003,
    AccountServer_Login = 2004,
    AccountServer_LoginFail = 2005,
    AccountServer_LoginSuccess= 2006,
    AccountServer_LoginToken = 2007,

    UserPlayerServer_Login = 3001,
    UserPlayerServer_LoginFail = 3002,
    UserPlayerServer_LoginSuccess= 3003,

    Res_Login = 4001,
    Res_LoginFail = 4002,
    Res_LoginSuccess= 4003,
    Res_GainRes = 4004,
}