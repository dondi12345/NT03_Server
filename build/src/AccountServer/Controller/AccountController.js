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
exports.LoginSuccess = exports.AccountLoginTocken = exports.AccountLogin = exports.AccountRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Account_1 = require("../Model/Account");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const AccountAuthen_1 = require("../Model/AccountAuthen");
const AccountData_1 = require("../Model/AccountData");
const AccountTocken_1 = require("../Model/AccountTocken");
const AuthenController_1 = require("../../AuthenServer/AuthenController");
const TockenAuthen_1 = require("../Model/TockenAuthen");
const saltRounds = 10;
function AccountRegister(message, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var account = Account_1.Account.Parse(message.Data);
            var isExisten = false;
            if (account.Username == null || account.Username == undefined) {
                response.send(RegisterFailMessage());
                return;
            }
            yield (0, Account_1.FindByUserName)(account.Username).then(res => {
                if (res == null || res == undefined)
                    return;
                isExisten = true;
            });
            if (isExisten) {
                response.send(RegisterFailMessage());
                return;
            }
            if (account.Password == null || account.Password == undefined) {
                response.send(RegisterFailMessage());
            }
            var pass = account.Password == undefined ? "" : account.Password + "";
            bcrypt_1.default.hash(pass, saltRounds, function (err, hash) {
                account.Password = hash;
                (0, Account_1.CreateAccount)(account).then((res) => {
                    console.log("Dev 1684646335 " + res);
                    response.send(RegisterSuccessMessage());
                });
            });
        }
        catch (error) {
            console.log("Dev 1684641453 " + error);
            response.send(RegisterFailMessage());
        }
    });
}
exports.AccountRegister = AccountRegister;
function RegisterFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_RegisterFail;
    return message;
}
function RegisterSuccessMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_RegisterSuccess;
    return message;
}
function AccountLogin(message, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1684684863 Login");
        try {
            var accountAuthen = AccountAuthen_1.AccountAuthen.Parse(message.Data);
            if (accountAuthen.Username == null || accountAuthen.Username == undefined || accountAuthen.Password == null || accountAuthen.Password == undefined) {
                console.log("Dev 1684937233 error format");
                response.send(JSON.stringify(LoginFailMessage()));
                return;
            }
            else {
                yield (0, Account_1.FindByUserName)(accountAuthen.Username).then((res) => {
                    if (res == null || res == undefined) {
                        console.log("Dev 1685266848 Account not found");
                        response.send(JSON.stringify(LoginFailMessage()));
                        return;
                    }
                    if (res.Password == null || res.Password == undefined) {
                        console.log("Dev 1685266848 Error password");
                        response.send(JSON.stringify(LoginFailMessage()));
                        return;
                    }
                    bcrypt_1.default.compare(accountAuthen.Password.toString(), res.Password.toString(), function (err, result) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (result) {
                                console.log("Dev 1684684470 Login successfull: ");
                                var accountData = new AccountData_1.AccountData();
                                accountData.IdAccount = res._id.toString();
                                accountData.IdDevice = accountAuthen.IdDevice;
                                var accountTocken = new AccountTocken_1.AccountTocken();
                                accountTocken.IdAccount = accountData.IdAccount;
                                accountTocken.Token = (0, AuthenController_1.AuthenGetToken)(JSON.parse(JSON.stringify(accountData)));
                                LoginSuccess(accountTocken, response);
                                return;
                            }
                            else {
                                console.log("Dev 1684684249 WrongPassword");
                                response.send(JSON.stringify(LoginFailMessage()));
                                return;
                            }
                        });
                    });
                });
            }
        }
        catch (error) {
            console.log("Dev 1684684560 " + error);
            response.send(LoginFailMessage());
        }
    });
}
exports.AccountLogin = AccountLogin;
function LoginFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_LoginFail;
    return message;
}
function AccountLoginTocken(message, response) {
    var tockenAuthen = TockenAuthen_1.TockenAuthen.Parse(message.Data);
    var data = (0, AuthenController_1.AuthenVerify)(tockenAuthen.Token);
    if (data == null || data == undefined) {
        response.send(LoginFailMessage());
        console.log("Dev 1684937265 wrong token");
        return;
    }
    else {
        var accountData = AccountData_1.AccountData.Parse(data);
        if (accountData.IdDevice != tockenAuthen.IdDevice) {
            console.log("Dev 1684937311 wrong device");
            response.send(LoginFailMessage());
            return;
        }
        var accountTocken = new AccountTocken_1.AccountTocken();
        accountTocken.IdAccount = accountData.IdAccount;
        accountTocken.Token = tockenAuthen.Token;
        LoginSuccess(accountTocken, response);
    }
}
exports.AccountLoginTocken = AccountLoginTocken;
function LoginSuccess(accountTocken, response) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.AccountServer_LoginSuccess;
    message.Data = JSON.stringify(accountTocken);
    response.send(JSON.stringify(message));
}
exports.LoginSuccess = LoginSuccess;
