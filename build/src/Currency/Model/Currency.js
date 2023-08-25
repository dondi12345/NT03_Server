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
exports.IncreaseNumber = exports.UpdateCurrency = exports.FindCurrencyByIdUserPlayer = exports.CreateUserPlayerCurrency = exports.CurrencyModel = exports.Currency = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DefaultCurrency_1 = require("./DefaultCurrency");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
class Currency {
    constructor() {
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.Currency = Currency;
const CurrencySchema = new mongoose_1.Schema({
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    Diamond: { type: Number, default: DefaultCurrency_1.DefaultCurrency.Diamond },
    Money: { type: Number, default: DefaultCurrency_1.DefaultCurrency.Money },
    Food: { type: Number, default: DefaultCurrency_1.DefaultCurrency.Food },
    Gold: { type: Number, default: DefaultCurrency_1.DefaultCurrency.Gold },
    Silver: { type: Number, default: DefaultCurrency_1.DefaultCurrency.Silver },
    EnchanceStone: { type: Number, default: DefaultCurrency_1.DefaultCurrency.EnchanceStone },
    MagicStone: { type: Number, default: DefaultCurrency_1.DefaultCurrency.MagicStone },
    HeroScroll_White: { type: Number, default: DefaultCurrency_1.DefaultCurrency.HeroScroll_White },
    BlueprintHeroEquip_White: { type: Number, default: DefaultCurrency_1.DefaultCurrency.BlueprintHeroEquip_White },
});
CurrencySchema.index({ IdUserPlayer: 1 }, { background: true });
exports.CurrencyModel = mongoose_1.default.model('Currency', CurrencySchema);
function CreateUserPlayerCurrency(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var userPlayerRes;
        yield exports.CurrencyModel.create(data).then((res) => {
            console.log("Dev 1684837676 " + res);
            userPlayerRes = Currency.Parse(res);
        }).catch((e) => {
            (0, LogController_1.LogServer)(LogCode_1.LogCode.Currency_CreateNewFail, e, LogModel_1.LogType.Error);
            console.log("Dev 1684837715 " + e);
        });
        return userPlayerRes;
    });
}
exports.CreateUserPlayerCurrency = CreateUserPlayerCurrency;
function FindCurrencyByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var userPlayerRes;
        yield exports.CurrencyModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
            userPlayerRes = Currency.Parse(res);
        });
        return userPlayerRes;
    });
}
exports.FindCurrencyByIdUserPlayer = FindCurrencyByIdUserPlayer;
function UpdateCurrency(currency, idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.CurrencyModel.updateOne({ IdUserPlayer: idUserPlayer }, {
            Diamond: currency.Diamond,
            Money: currency.Money,
            Food: currency.Food,
            Gold: currency.Gold,
            Silver: currency.Silver,
            EnchanceStone: currency.EnchanceStone,
            MagicStone: currency.MagicStone,
        }).then(res => {
            console.log("Dev 1684851978 " + JSON.stringify(res));
        }).catch(e => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.Currency_SaveFail, idUserPlayer.toString(), e, LogModel_1.LogType.Error);
        });
    });
}
exports.UpdateCurrency = UpdateCurrency;
function IncreaseNumber(nameCurrency, number, idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.CurrencyModel.updateOne({ IdUserPlayer: idUserPlayer }, { $inc: { [nameCurrency]: number } }).then(respone => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.Currency_IncreaseNumber, idUserPlayer.toString(), "", LogModel_1.LogType.Normal);
            console.log("Dev 1686733379 ", respone);
        }).catch(err => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.Currency_IncreaseNumberFail, idUserPlayer.toString(), err, LogModel_1.LogType.Error);
        });
    });
}
exports.IncreaseNumber = IncreaseNumber;
