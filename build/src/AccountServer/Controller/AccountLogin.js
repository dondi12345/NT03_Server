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
exports.accountLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DataModel_1 = require("../../Utils/DataModel");
const Account_1 = require("../Model/Account");
const TokenModel_1 = require("../../Token/Model/TokenModel");
const TokenAccount_1 = require("../../Token/Model/TokenAccount");
const TockenController_1 = require("../../Token/Controller/TockenController");
class AccountLoginData {
}
class AccountLogin {
    AccountLogin(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1684684863 Login");
            try {
                var accountLoginData = DataModel_1.DataModel.Parse(message.Data);
                if (accountLoginData.Username == null || accountLoginData.Username == undefined || accountLoginData.Password == null || accountLoginData.Password == undefined) {
                    LogController_1.logController.LogDev("1684937233 error format");
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, "Inval format", transferData.Token);
                    transferData.Send(JSON.stringify(this.LoginFailMessage("Inval format")));
                    return;
                }
                else {
                    (0, Account_1.FindByUserName)(accountLoginData.Username).then((res) => {
                        if (res == null || res == undefined) {
                            LogController_1.logController.LogDev("1685266848 Account not found");
                            LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, "Account not found", transferData.Token);
                            transferData.Send(JSON.stringify(this.LoginFailMessage("Account not found")));
                            return;
                        }
                        if (res.Password == null || res.Password == undefined) {
                            LogController_1.logController.LogDev("1685266848 Error password");
                            transferData.Send(JSON.stringify(this.LoginFailMessage("Error password")));
                            LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, "Error password", transferData.Token);
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
                                        tokenModel.Token = TockenController_1.tockenController.AuthenGetToken(JSON.parse(JSON.stringify(tokenAccount)));
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                    transferData.Send(JSON.stringify(tokenModel));
                                    LogController_1.logController.LogMessage(LogCode_1.LogCode.AccountServer_LoginSuccess, accountLoginData.Username.toString(), tokenModel.Token);
                                    return;
                                }
                                else {
                                    LogController_1.logController.LogDev("1684684249 WrongPassword");
                                    LogController_1.logController.LogWarring(LogCode_1.LogCode.AccountServer_LoginFail, "WrongPassword", accountLoginData.Username);
                                    transferData.Send(JSON.stringify(this.LoginFailMessage("WrongPassword")));
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
                transferData.Send(this.LoginFailMessage(error));
            }
        });
    }
    LoginFailMessage(error) {
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.AccountServer_LoginFail;
        message.Data = error;
        return message;
    }
}
exports.accountLogin = new AccountLogin();
