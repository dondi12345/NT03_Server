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
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyController = void 0;
const mongoose_1 = require("mongoose");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const Currency_1 = require("../Model/Currency");
const DataModel_1 = require("../../Utils/DataModel");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const Env_1 = require("../../Enviroment/Env");
const TockenController_1 = require("../../Token/Controller/TockenController");
class CurrencyController {
    CurrencyLogin(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                return LoginFail_New(transferData);
            }
            var currency = yield FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
            if (currency == null || currency == undefined) {
                LogController_1.logController.LogDev("1685077925 Dev Not found currency");
                return LoginFail_New(transferData);
            }
            return LoginSuccess(currency, transferData);
        });
    }
    AddCurrency(data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(token);
            if (tokenUserPlayer == null)
                return null;
            var currency;
            yield Currency_1.CurrencyModel.updateOne({
                IdUserPlayer: tokenUserPlayer.IdUserPlayer
            }, {
                $inc: data
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.Currency_AddSuccess, res, token);
                if (res.modifiedCount == 0 && res.matchedCount == 0) {
                    LogController_1.logController.LogError(LogCode_1.LogCode.Currency_AddNotFound, "", token);
                    currency = null;
                    return currency;
                }
                else {
                    if (tokenUserPlayer == null)
                        return;
                    currency = yield FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
                    return currency;
                }
            })).catch(err => {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Currency_AddFail, err, token);
                currency = null;
                return null;
            });
            return currency;
        });
    }
    GetCurrencyCached(userPlayerID) {
        return __awaiter(this, void 0, void 0, function* () {
            var currencyJson = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                reslove(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyCurrencyData(userPlayerID)));
            }));
            if (currencyJson == null || currencyJson == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Currency_NotFoundInCache, userPlayerID, "Server");
                return new Currency_1.Currency();
                ;
            }
            return DataModel_1.DataModel.Parse(currencyJson);
        });
    }
    SetCurrencyCached(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyCurrencyData(currency.IdUserPlayer), JSON.stringify(currency));
        });
    }
}
exports.currencyController = new CurrencyController();
function LoginSuccess(currency, transferData) {
    return __awaiter(this, void 0, void 0, function* () {
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.Currency_LoginSuccess;
        message.Data = JSON.stringify(currency);
        transferData.Send(JSON.stringify(message));
        return message;
    });
}
function LoginFail_New(transferData) {
    return __awaiter(this, void 0, void 0, function* () {
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.Currency_LoginFail;
        transferData.Send(JSON.stringify(message));
        return message;
    });
}
function FindByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield Currency_1.CurrencyModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
            data = res;
            LogController_1.logController.LogDev("1685077936 Dev ", res);
        }).catch((err) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogWarring(LogCode_1.LogCode.Currency_NotFoundInDB, idUserPlayer + ":" + err, "Server");
        }));
        if (data == null || data == undefined) {
            var currency = new Currency_1.Currency();
            currency.IdUserPlayer = new mongoose_1.Types.ObjectId(idUserPlayer);
            yield Currency_1.CurrencyModel.create(currency).then(res => {
                data = res;
                LogController_1.logController.LogDev("1685077947 Dev ", res);
            }).catch(err => {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Currency_CreateNewFail, idUserPlayer + ":" + err, "Server");
                data = null;
            });
        }
        var currency = DataModel_1.DataModel.Parse(data);
        exports.currencyController.SetCurrencyCached(currency);
        return currency;
    });
}
