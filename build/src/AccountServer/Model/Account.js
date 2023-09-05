"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountAccount = exports.FindByUserName = exports.CreateAccount = exports.GetAccountById = exports.AccountModel = exports.Account = exports.AccountRegisterData = exports.AccountLoginData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
class AccountLoginData {
}
exports.AccountLoginData = AccountLoginData;
class AccountRegisterData {
}
exports.AccountRegisterData = AccountRegisterData;
class Account {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.Account = Account;
const AccountSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    Username: { type: String },
    Password: { type: String }
});
exports.AccountModel = mongoose_1.default.model('Account', AccountSchema);
function GetAccountById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var Account = new Account();
        yield exports.AccountModel.findById(_id).then((res) => {
            Account = Account.Parse(res);
        }).catch((err) => {
            console.log(err);
        });
        return Account;
    });
}
exports.GetAccountById = GetAccountById;
function CreateAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        var newAccount;
        account._id = new mongoose_1.Types.ObjectId();
        yield exports.AccountModel.create(account).then(res => {
            newAccount = res;
            (0, LogController_1.LogServer)(LogCode_1.LogCode.AccountServer_CreateNew, JSON.stringify(res), LogModel_1.LogType.Normal);
        }).catch(err => {
            (0, LogController_1.LogServer)(LogCode_1.LogCode.AccountServer_CreateFail, err, LogModel_1.LogType.Error);
        });
        return newAccount;
    });
}
exports.CreateAccount = CreateAccount;
function FindByUserName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        var account;
        yield exports.AccountModel.findOne({ Username: username }).then(res => {
            account = res;
        });
        return account;
    });
}
exports.FindByUserName = FindByUserName;
function CountAccount(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.AccountModel.count({}).then(res => {
            console.log(res);
            callback(null, res);
        }).catch(err => {
            callback(err, null);
        });
    });
}
exports.CountAccount = CountAccount;
