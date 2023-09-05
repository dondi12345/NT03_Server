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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Account_1 = require("../Model/Account");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const DataModel_1 = require("../../Utils/DataModel");
const TokenAccount_1 = require("../../Token/Model/TokenAccount");
const TokenModel_1 = require("../../Token/Model/TokenModel");
const TockenController_1 = require("../../Token/Controller/TockenController");
const saltRounds = 10;
class AccountController {
    AccountRegister(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var accountRegisterData = DataModel_1.DataModel.Parse(message.Data);
                var isExisten = false;
                if (accountRegisterData.Username == null || accountRegisterData.Username == undefined) {
                    transferData.Send(JSON.stringify(RegisterFailMessage("Inval Username")));
                    return;
                }
                yield (0, Account_1.FindByUserName)(accountRegisterData.Username).then(res => {
                    if (res == null || res == undefined)
                        return;
                    isExisten = true;
                });
                if (isExisten) {
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_RegisterFail, "Account existen", accountRegisterData.Username);
                    transferData.Send(JSON.stringify(RegisterFailMessage("Account existen")));
                    return;
                }
                if (accountRegisterData.Password == null || accountRegisterData.Password == undefined) {
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_RegisterFail, "Wrong confirm password", accountRegisterData.Username);
                    transferData.Send(JSON.stringify(RegisterFailMessage("Wrong confirm password")));
                }
                var pass = accountRegisterData.Password == undefined ? "" : accountRegisterData.Password + "";
                bcrypt_1.default.hash(pass, saltRounds, function (err, hash) {
                    var account = new Account_1.Account();
                    account.Username = accountRegisterData.Username;
                    account.Password = hash;
                    (0, Account_1.CreateAccount)(account).then((res) => {
                        console.log("Dev 1684646335 " + res);
                        LogController_1.logController.LogMessage(LogCode_1.LogCode.AccountServer_RegisterSuccess, accountRegisterData.Username, "Server");
                        transferData.Send(JSON.stringify(RegisterSuccessMessage()));
                    });
                });
            }
            catch (error) {
                console.log("Dev 1684641453 " + error);
                LogController_1.logController.LogError(LogCode_1.LogCode.AccountServer_RegisterFail, JSON.stringify(error), "Server");
                transferData.Send(JSON.stringify(RegisterFailMessage(error)));
            }
        });
    }
    AccountLogin(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1684684863 Login");
            try {
                var accountLoginData = DataModel_1.DataModel.Parse(message.Data);
                if (accountLoginData.Username == null || accountLoginData.Username == undefined || accountLoginData.Password == null || accountLoginData.Password == undefined) {
                    LogController_1.logController.LogDev("1684937233 error format");
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, accountLoginData.Username + " Inval format", "Server");
                    transferData.Send(JSON.stringify(LoginFailMessage("Inval format")));
                    return;
                }
                else {
                    (0, Account_1.FindByUserName)(accountLoginData.Username).then((res) => {
                        if (res == null || res == undefined) {
                            LogController_1.logController.LogDev("1685266848 Account not found");
                            LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, accountLoginData.Username + " Account not found", "Server");
                            transferData.Send(JSON.stringify(LoginFailMessage("Account not found")));
                            return;
                        }
                        if (res.Password == null || res.Password == undefined) {
                            LogController_1.logController.LogDev("1685266848 Error password");
                            transferData.Send(JSON.stringify(LoginFailMessage("Error password")));
                            LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, accountLoginData.Username + " Error password", "Server");
                            return;
                        }
                        bcrypt_1.default.compare(accountLoginData.Password.toString(), res.Password.toString(), function (err, result) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (result) {
                                    LogController_1.logController.LogDev("1684684470 Login successfull: ", res._id);
                                    var tokenAccount = new TokenAccount_1.TokenAccount();
                                    tokenAccount.IdAccount = res._id.toString();
                                    tokenAccount.IdDevice = accountLoginData.IdDevice;
                                    var tokenModel = new TokenModel_1.TokenModel();
                                    try {
                                        tokenModel.Token = TockenController_1.tokenController.AuthenGetToken(JSON.parse(JSON.stringify(tokenAccount)));
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                    transferData.Send(JSON.stringify(LoginSuccessMessage(JSON.stringify(tokenModel))));
                                    LogController_1.logController.LogMessage(LogCode_1.LogCode.AccountServer_LoginSuccess, accountLoginData.Username.toString(), tokenModel.Token);
                                    return;
                                }
                                else {
                                    LogController_1.logController.LogDev("1684684249 WrongPassword");
                                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, accountLoginData.Username + " WrongPassword", "Server");
                                    transferData.Send(JSON.stringify(LoginFailMessage("WrongPassword")));
                                    return;
                                }
                            });
                        });
                    });
                }
            }
            catch (error) {
                console.log("Dev 1684684560 " + error);
                LogController_1.logController.LogError(LogCode_1.LogCode.AccountServer_LoginFail, error, "Server");
                transferData.Send(LoginFailMessage(error));
            }
        });
    }
}
function RegisterFailMessage(err) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_RegisterFail;
    message.Data = err;
    return message;
}
function RegisterSuccessMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_RegisterSuccess;
    return message;
}
function LoginFailMessage(error) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_LoginFail;
    message.Data = error;
    return message;
}
function LoginSuccessMessage(data) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_LoginSuccess;
    message.Data = data;
    return message;
}
exports.accountController = new AccountController();
