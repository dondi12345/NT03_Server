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
exports.heroController = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const Hero_1 = require("../Model/Hero");
const HeroCode_1 = require("../Model/HeroCode");
const SummonHero_1 = require("../Model/SummonHero");
const VariableHero_1 = require("../Model/VariableHero");
const Env_1 = require("../../Enviroment/Env");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogController_1 = require("../../LogServer/Controller/LogController");
const TockenController_1 = require("../../Token/Controller/TockenController");
const DataModel_1 = require("../../Utils/DataModel");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const DateUtils_1 = require("../../Utils/DateUtils");
const DataVersion_1 = require("../../DataCenter/Model/DataVersion");
const DataCenterController_1 = require("../../DataCenter/Controller/DataCenterController");
const Other_1 = require("../../Utils/Other");
class HeroController {
    Login(message, transferData) {
        var message, message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.Hero_LoginFail;
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_LoginFail, "", transferData.Token);
                transferData.Send(JSON.stringify(message));
                return;
            }
            var heroes = yield FindHeroesByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
            LogController_1.logController.LogDev("Dev 1685979990 " + heroes.Elements.length);
            LogController_1.logController.LogMessage(LogCode_1.LogCode.Hero_LoginSuccess, "", transferData.Token);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_LoginSuccess;
            message.Data = JSON.stringify(heroes);
            transferData.Send(JSON.stringify(message));
        });
    }
    Summon(message, transferData) {
        var message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
                return;
            }
            var currency = DataModel_1.DataModel.Parse(yield CurrencyController_1.currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer));
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
                return;
            }
            if (currency.HeroScroll_White <= 0) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_NotEnoughtSummon, "", transferData.Token);
                transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
                return;
            }
            currency = yield CurrencyController_1.currencyController.AddCurrency({ HeroScroll_White: -1 }, transferData.Token);
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
                return;
            }
            var summonHero = RandomeSummonHero(tokenUserPlayer.IdUserPlayer);
            var messageUpdateCurency = new Message_1.Message();
            messageUpdateCurency.MessageCode = MessageCode_1.MessageCode.Currency_Update;
            messageUpdateCurency.Data = JSON.stringify(currency);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_SummonSuccess;
            message.Data = JSON.stringify(summonHero);
            transferData.Send(JSON.stringify(messageUpdateCurency), JSON.stringify(message));
        });
    }
    GetSummonResult(message, transferData) {
        var message, message, message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.Hero_GetSummonResultFail;
                transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
                return;
            }
            var summonHero = DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer)));
            if (summonHero == null || summonHero == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_GetSummonResultFail, "", transferData.Token);
                message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.Hero_SendSummonResult;
                message.Data = JSON.stringify(summonHero);
                transferData.Send(JSON.stringify(message));
                return;
            }
            LogController_1.logController.LogMessage(LogCode_1.LogCode.Hero_GetSummonResultSuc, "", transferData.Token);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_SendSummonResult;
            message.Data = JSON.stringify(summonHero);
            transferData.Send(JSON.stringify(message));
        });
    }
    HireHero(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(JSON.stringify(HireFail()));
                return;
            }
            var summonHeroSlot = DataModel_1.DataModel.Parse(message.Data);
            var summonHero = DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer)));
            if (summonHeroSlot == null || summonHeroSlot == undefined || summonHero == null || summonHero == undefined) {
                transferData.Send(JSON.stringify(HireFail()));
                return;
            }
            var indexFindout = -1;
            for (let index = 0; index < summonHero.Slots.length; index++) {
                const element = summonHero.Slots[index];
                if (element._id.toString() === summonHeroSlot._id.toString() && !element.Hired) {
                    element.Hired = true;
                    indexFindout = index;
                    break;
                }
            }
            if (indexFindout == -1) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_HireFail, "Not Found", transferData.Token);
                transferData.Send(JSON.stringify(HireFail()));
                return;
            }
            var hero = DataModel_1.DataModel.Parse(summonHero.Slots[indexFindout].Hero);
            if (hero == null || hero == undefined || hero.Code == HeroCode_1.HeroCode.Unknown) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_HireFail, "Fail Parse", transferData.Token);
                transferData.Send(JSON.stringify(HireFail()));
                return;
            }
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer), JSON.stringify(summonHero));
            var heroNew = yield CreateNewHero(hero, transferData.Token);
            var messageHero = new Message_1.Message();
            messageHero.MessageCode = MessageCode_1.MessageCode.Hero_SummonSuccess;
            messageHero.Data = JSON.stringify(heroNew);
            var messageResult = new Message_1.Message();
            messageResult.MessageCode = MessageCode_1.MessageCode.Hero_SendSummonResult;
            messageResult.Data = JSON.stringify(summonHero);
            transferData.Send(JSON.stringify(messageHero), JSON.stringify(messageResult));
        });
    }
    UpgradeLv(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            var heroUpgradeLv = DataModel_1.DataModel.Parse(message.Data);
            var hero = DataModel_1.DataModel.Parse(yield exports.heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, heroUpgradeLv.IdHero.toString()));
            if (hero == null || hero == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "Not found hero in cache", transferData.Token);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            var heroData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataHero, hero.Code.toString()));
            if (heroData == null || heroData == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "Not found heroData in cache", transferData.Token);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            var cost = HeroCostUpgradeLv(hero.Lv, heroUpgradeLv.NumberLv, heroData.CostUpgrade, heroData.CostUpgradeRise);
            var currency = DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyCurrencyData(tokenUserPlayer.IdUserPlayer)));
            if (currency == null || currency == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "Not found currency in cache", transferData.Token);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            if (currency.Food < cost) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "Not currency don't enought", transferData.Token);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            hero = yield HeroLvUp(heroUpgradeLv.IdHero, heroUpgradeLv.NumberLv);
            if (hero == null || hero == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "HeroLvUp Fail", transferData.Token);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            currency = yield CurrencyController_1.currencyController.AddCurrency({ Food: -cost }, transferData.Token);
            if (currency == null || currency == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_UpgradeLvFail, "Currency update Fail", transferData.Token);
                yield HeroLvUp(heroUpgradeLv.IdHero, -heroUpgradeLv.NumberLv);
                transferData.Send(JSON.stringify(UpgradeFail()));
                return;
            }
            var messageUdHero = new Message_1.Message();
            messageUdHero.MessageCode = MessageCode_1.MessageCode.Hero_UpdateHero;
            messageUdHero.Data = JSON.stringify(hero);
            var messageUdCurrency = new Message_1.Message();
            messageUdCurrency.MessageCode = MessageCode_1.MessageCode.Currency_Update;
            messageUdCurrency.Data = JSON.stringify(currency);
            transferData.Send(JSON.stringify(messageUdHero), JSON.stringify(messageUdCurrency));
        });
    }
    UpdateGear(heroID, heroGear) {
        return __awaiter(this, void 0, void 0, function* () {
            var hero;
            yield Hero_1.HeroModel.updateOne({
                _id: heroID,
            }, {
                HeroGear: heroGear
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                LogController_1.logController.LogDev("1691055269: ", res);
                if (res.modifiedCount == 0 && res.matchedCount == 0) {
                    LogController_1.logController.LogError(LogCode_1.LogCode.Hero_NotFoundInDB, heroID, "Server");
                    hero = null;
                    return hero;
                }
                else {
                    hero = FindById(heroID);
                    exports.heroController.SetHeroCached(hero);
                    return hero;
                }
            }));
            return hero;
        });
    }
    GetHeroCached(userPlayerID, heroID) {
        return __awaiter(this, void 0, void 0, function* () {
            var heroJson = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                reslove(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyHeroData(userPlayerID, heroID)));
            }));
            if (heroJson == null || heroJson == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_NotFoundInCache, userPlayerID, "Server");
                return null;
            }
            return DataModel_1.DataModel.Parse(heroJson);
        });
    }
    SetHeroCached(hero) {
        return __awaiter(this, void 0, void 0, function* () {
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyHeroData(hero.IdUserPlayer, hero._id), JSON.stringify(hero));
        });
    }
}
exports.heroController = new HeroController();
function SummonFail(token) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_SummonFail;
    LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_SummonFail, "", token);
    return message;
}
function FindHeroesByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield Hero_1.HeroModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
            data = res;
            LogController_1.logController.LogDev("1691833750 Dev ", res);
        }).catch((err) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogError(LogCode_1.LogCode.Hero_NotFoundInDB, idUserPlayer + ":" + err, "Server");
        }));
        if (data == null || data == undefined) {
            LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_Empty, idUserPlayer, "Server");
            data = [];
        }
        var heroes = new Other_1.NTArray();
        for (let item of data) {
            var hero = DataModel_1.DataModel.Parse(item);
            heroes.Elements.push(hero);
            exports.heroController.SetHeroCached(hero);
        }
        return heroes;
    });
}
function RandomeSummonHero(idUserPlayer, rank = 0) {
    var rateSummon = VariableHero_1.RateSummon[rank];
    var totalRate = 0;
    for (let property in rateSummon) {
        totalRate += rateSummon[property];
    }
    var summonHero = new SummonHero_1.SummonHero();
    summonHero.Version = DateUtils_1.dateUtils.GetCurrentDateNumber().toString();
    summonHero.Slots = [];
    for (let index = 0; index < 7; index++) {
        var rate = Math.floor(Math.random() * totalRate);
        for (let property in rateSummon) {
            if (rate < rateSummon[property]) {
                var summonHeroSlot = new SummonHero_1.SummonHeroSlot();
                var hero = new Hero_1.Hero();
                hero.InitData(idUserPlayer, HeroCode_1.HeroCode[property]);
                summonHeroSlot.Hero = hero;
                summonHeroSlot.Hired = false;
                summonHero.Slots.push(summonHeroSlot);
                break;
            }
            rate -= rateSummon[property];
        }
    }
    RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyHeroSummon(idUserPlayer), JSON.stringify(summonHero));
    return summonHero;
}
function HireFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_HireHeroFail;
    return message;
}
function CreateNewHero(hero, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield Hero_1.HeroModel.create(hero).then(res => {
            LogController_1.logController.LogMessage(LogCode_1.LogCode.Hero_CreateSuc, res, token);
            data = res;
        }).catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.Hero_CreateFail, err, token);
            data = null;
        });
        return DataModel_1.DataModel.Parse(data);
    });
}
function UpgradeFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_UpgradeLvFail;
    return message;
}
function HeroCostUpgradeLv(lv, lvRise, start, raise) {
    var result = 0;
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}
function HeroLvUp(idHero, lv) {
    return __awaiter(this, void 0, void 0, function* () {
        var hero;
        yield Hero_1.HeroModel.updateOne({
            _id: idHero,
        }, {
            $inc: { Lv: lv }
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1691055270: ", res);
            if (res.modifiedCount == 0 && res.matchedCount == 0) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Hero_NotFoundInDB, idHero, "Server");
                hero = null;
                return hero;
            }
            else {
                hero = yield FindById(idHero);
                exports.heroController.SetHeroCached(hero);
                return hero;
            }
        })).catch(err => {
            LogController_1.logController.LogWarring(LogCode_1.LogCode.Hero_HeroLvUpFail, err, "Server");
            return null;
        });
        return hero;
    });
}
function FindById(idHero) {
    return __awaiter(this, void 0, void 0, function* () {
        var hero;
        yield Hero_1.HeroModel.findById(idHero)
            .then(res => {
            hero = res;
            exports.heroController.SetHeroCached(hero);
            return hero;
        })
            .catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.Hero_NotFoundInDB, idHero, "Server");
            hero = null;
            return hero;
        });
        return hero;
    });
}
