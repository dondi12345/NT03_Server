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
exports.heroEquipController = void 0;
const mongoose_1 = require("mongoose");
const HeroCode_1 = require("../../HeroServer/Model/HeroCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const HeroEquip_1 = require("../Model/HeroEquip");
const HeroEquipType_1 = require("../Model/HeroEquipType");
const HeroEquipConfig_1 = require("../Model/HeroEquipConfig");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const HeroEquipCode_1 = require("../Model/HeroEquipCode");
const TockenController_1 = require("../../Token/Controller/TockenController");
const Other_1 = require("../../Utils/Other");
const DataModel_1 = require("../../Utils/DataModel");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const Env_1 = require("../../Enviroment/Env");
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const DataVersion_1 = require("../../DataCenter/Model/DataVersion");
const ItemCode_1 = require("../../Item/Model/ItemCode");
const DataCenterController_1 = require("../../DataCenter/Controller/DataCenterController");
const HeroController_1 = require("../../HeroServer/Controller/HeroController");
class HeroEquipController {
    Login(message, transferData) {
        var message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
                return LoginFail(transferData);
            }
            var heroEquips = yield FindHeroEquipsByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
            LogController_1.logController.LogDev("Dev 1692090211 Heroequip: " + heroEquips.Elements.length);
            LogController_1.logController.LogMessage(LogCode_1.LogCode.HeroEquip_LoginSuccess, "", transferData.Token);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroEquip_LoginSuccess;
            message.Data = JSON.stringify(heroEquips);
            transferData.Send(JSON.stringify(message));
        });
    }
    CraftEquip(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
                transferData.Send(JSON.stringify(CraftFail()));
                return CraftFail();
            }
            var craftHeroEquip = DataModel_1.DataModel.Parse(message.Data);
            var currency = yield CurrencyController_1.currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer);
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(CraftFail()));
                return CraftFail();
            }
            if (currency.BlueprintHeroEquip_White < 1) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_NotEnoughForCraft, "BlueprintHeroEquip_White", transferData.Token);
                transferData.Send(JSON.stringify(CraftFail()));
                return CraftFail();
            }
            currency = yield CurrencyController_1.currencyController.AddCurrency({ BlueprintHeroEquip_White: -1 }, transferData.Token);
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(CraftFail()));
                return CraftFail();
            }
            var messageUdCurrency = new Message_1.Message();
            messageUdCurrency.MessageCode = MessageCode_1.MessageCode.Currency_Update;
            messageUdCurrency.Data = JSON.stringify(currency);
            var heroEquip = yield CreateRandomHeroEquip_White(tokenUserPlayer.IdUserPlayer);
            if (heroEquip == null || heroEquip == undefined) {
                transferData.Send(JSON.stringify(messageUdCurrency), JSON.stringify(CraftFail()));
                return CraftFail();
            }
            var messageCraftSuc = new Message_1.Message();
            messageCraftSuc.MessageCode = MessageCode_1.MessageCode.HeroEquip_CraftSuccess;
            messageCraftSuc.Data = JSON.stringify(heroEquip);
            transferData.Send(JSON.stringify(messageUdCurrency), JSON.stringify(messageCraftSuc));
        });
    }
    UpgradeLv(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            var heroEquipUpgradeLv = HeroEquip_1.HeroEquipUpgradeLv.Parse(message.Data);
            var heroEquip = yield this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroEquipUpgradeLv.IdEquip.toString());
            LogController_1.logController.LogDev("1692160771 ", heroEquip);
            if (heroEquip == null || heroEquip == undefined) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            var currency = yield CurrencyController_1.currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer);
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            var heroEquipData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
            if (heroEquipData == null || heroEquipData == undefined) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            LogController_1.logController.LogDev("1692172832 ", heroEquipData);
            var cost = CostUpgradeLv(heroEquip.Lv, heroEquipUpgradeLv.NumberLv, heroEquipData.CostUpgrade, heroEquipData.CostUpgradeRise);
            if (cost > currency.Money) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            LogController_1.logController.LogDev("1692172830 " + cost);
            currency = yield CurrencyController_1.currencyController.AddCurrency({ Money: -cost }, transferData.Token);
            if (currency == null || currency == undefined) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            heroEquip = yield HeroEquipLvUp(heroEquipUpgradeLv.IdEquip, heroEquipUpgradeLv.NumberLv);
            if (heroEquip == null || heroEquip == undefined) {
                transferData.Send(JSON.stringify(UpgradelvFail()));
                return UpgradelvFail();
            }
            var messageLvUp = new Message_1.Message();
            messageLvUp.MessageCode = MessageCode_1.MessageCode.HeroEquip_UpgradeLvSuc;
            messageLvUp.Data = JSON.stringify(heroEquip);
            var messageUdCurrency = new Message_1.Message();
            messageUdCurrency.MessageCode = MessageCode_1.MessageCode.Currency_Update;
            messageUdCurrency.Data = JSON.stringify(currency);
            transferData.Send(JSON.stringify(messageLvUp), JSON.stringify(messageUdCurrency));
        });
    }
    WearingEquip(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            var heroWearEquip = DataModel_1.DataModel.Parse(message.Data);
            var hero = yield HeroController_1.heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHero.toString());
            if (hero == null || hero == undefined || hero.Code == HeroCode_1.HeroCode.Unknown) {
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            var heroEquip = yield this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHeroEquip.toString());
            if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode_1.HeroEquipCode.Unknown) {
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            var heroEquipData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
            var idHeroEquip_Old = "";
            LogController_1.logController.LogDev("Dev 1691055135 Type: " + heroEquipData.HeroEquipType);
            if (heroEquipData.HeroEquipType === HeroEquipType_1.HeroEquipType.Weapon) {
                if (hero.HeroGear.IdWeapon != undefined && hero.HeroGear.IdWeapon != null)
                    idHeroEquip_Old = hero.HeroGear.IdWeapon;
                hero.HeroGear.IdWeapon = heroEquip._id;
                heroEquip.IdHero = hero._id;
                LogController_1.logController.LogDev("Dev 1691055136 IdWeapon");
            }
            if (heroEquipData.HeroEquipType === HeroEquipType_1.HeroEquipType.Armor) {
                if (hero.HeroGear.IdArmor != undefined && hero.HeroGear.IdArmor != null)
                    idHeroEquip_Old = hero.HeroGear.IdArmor;
                hero.HeroGear.IdArmor = heroEquip._id;
                heroEquip.IdHero = hero._id;
                LogController_1.logController.LogDev("Dev 1691055137 IdArmor");
            }
            if (heroEquipData.HeroEquipType === HeroEquipType_1.HeroEquipType.Helmet) {
                if (hero.HeroGear.IdHelmet != undefined && hero.HeroGear.IdHelmet != null)
                    idHeroEquip_Old = hero.HeroGear.IdHelmet;
                hero.HeroGear.IdHelmet = heroEquip._id;
                heroEquip.IdHero = hero._id;
                LogController_1.logController.LogDev("Dev 1691055138 IdHelmet");
            }
            if (idHeroEquip_Old == heroEquip._id) {
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            LogController_1.logController.LogDev("1692266425", hero, heroEquip);
            var messageOldEquip = new Message_1.Message();
            if (idHeroEquip_Old != null && idHeroEquip_Old != undefined && idHeroEquip_Old.length > 0) {
                var heroEquip_Old = yield UpdateHeroInHeroEquip(new mongoose_1.Types.ObjectId(idHeroEquip_Old), "");
                if (heroEquip_Old == null || heroEquip_Old == undefined) {
                    transferData.Send(JSON.stringify(WearFail()));
                    return WearFail();
                }
                else {
                    messageOldEquip.MessageCode = MessageCode_1.MessageCode.HeroEquip_UpdateEquip;
                    messageOldEquip.Data = JSON.stringify(heroEquip_Old);
                }
            }
            heroEquip = yield UpdateHeroInHeroEquip(heroEquip._id, heroEquip.IdHero);
            if (heroEquip == null || heroEquip == undefined) {
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            hero = yield HeroController_1.heroController.UpdateGear(hero._id, hero.HeroGear);
            if (hero == null || hero == undefined) {
                heroEquip = yield UpdateHeroInHeroEquip(heroEquip._id, "");
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }
            LogController_1.logController.LogDev("1692266426", hero, heroEquip);
            var messageUdEquip = new Message_1.Message();
            messageUdEquip.MessageCode = MessageCode_1.MessageCode.HeroEquip_WearingSuccess;
            messageUdEquip.Data = JSON.stringify(heroEquip);
            var messageWearSuc = new Message_1.Message();
            messageWearSuc.MessageCode = MessageCode_1.MessageCode.Hero_UpdateHero;
            messageWearSuc.Data = JSON.stringify(hero);
            transferData.Send(messageOldEquip, messageUdEquip, messageWearSuc);
        });
    }
    UnWearingEquip(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
                transferData.Send(JSON.stringify(UnWearFail()));
                return UnWearFail();
            }
            var heroWearEquip = DataModel_1.DataModel.Parse(message.Data);
            var hero = yield HeroController_1.heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHero.toString());
            if (hero == null || hero == undefined || hero.Code == HeroCode_1.HeroCode.Unknown) {
                transferData.Send(JSON.stringify(UnWearFail()));
                return UnWearFail();
            }
            var heroEquip = yield this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHeroEquip.toString());
            if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode_1.HeroEquipCode.Unknown) {
                transferData.Send(JSON.stringify(UnWearFail()));
                return UnWearFail();
            }
            var heroEquipData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
            switch (heroEquipData.HeroEquipType) {
                case HeroEquipType_1.HeroEquipType.Weapon:
                    if (hero.HeroGear.IdWeapon.length == 0) {
                        transferData.Send(JSON.stringify(UnWearFail()));
                        return UnWearFail();
                    }
                    hero.HeroGear.IdWeapon = "";
                    break;
                case HeroEquipType_1.HeroEquipType.Armor:
                    hero.HeroGear.IdArmor = "";
                    if (hero.HeroGear.IdArmor.length == 0) {
                        transferData.Send(JSON.stringify(UnWearFail()));
                        return UnWearFail();
                    }
                    break;
                case HeroEquipType_1.HeroEquipType.Helmet:
                    if (hero.HeroGear.IdHelmet.length == 0) {
                        transferData.Send(JSON.stringify(UnWearFail()));
                        return UnWearFail();
                    }
                    hero.HeroGear.IdHelmet = "";
                    break;
            }
            heroEquip.IdHero = "";
            heroEquip = yield UpdateHeroInHeroEquip(heroEquip._id, heroEquip.IdHero);
            if (heroEquip == null || heroEquip == undefined) {
                transferData.Send(JSON.stringify(UnWearFail()));
                return UnWearFail();
            }
            hero = yield HeroController_1.heroController.UpdateGear(hero._id, hero.HeroGear);
            if (hero == null || hero == undefined) {
                heroEquip = yield UpdateHeroInHeroEquip(heroEquip._id, heroWearEquip.IdHero.toString());
                transferData.Send(JSON.stringify(UnWearFail()));
                return UnWearFail();
            }
            var messageUdEquip = new Message_1.Message();
            messageUdEquip.MessageCode = MessageCode_1.MessageCode.HeroEquip_UnwearingSuccess;
            messageUdEquip.Data = JSON.stringify(heroEquip);
            var messageWearSuc = new Message_1.Message();
            messageWearSuc.MessageCode = MessageCode_1.MessageCode.Hero_UpdateHero;
            messageWearSuc.Data = JSON.stringify(hero);
            transferData.Send(messageUdEquip, messageWearSuc);
        });
    }
    GetHeroEquipCached(userPlayerID, heroEquipID) {
        return __awaiter(this, void 0, void 0, function* () {
            var heroEquipJson = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                reslove(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyHeroEquipData(userPlayerID, heroEquipID)));
            }));
            if (heroEquipJson == null || heroEquipJson == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_NotFoundInCache, userPlayerID, "Server");
                return null;
            }
            return DataModel_1.DataModel.Parse(heroEquipJson);
        });
    }
    SetHeroEquipCached(heroEquip) {
        return __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1692095951", heroEquip);
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyHeroEquipData(heroEquip.IdUserPlayer.toString(), heroEquip._id.toString()), JSON.stringify(heroEquip));
        });
    }
}
exports.heroEquipController = new HeroEquipController();
function LoginFail(transferData) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_LoginFail;
    transferData.Send(JSON.stringify(message));
    return message;
}
function FindHeroEquipsByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield HeroEquip_1.HeroEquipModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
            data = res;
            LogController_1.logController.LogDev("1692085245 Dev ", res);
        }).catch((err) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_NotFoundInDB, idUserPlayer + ":" + err, "Server");
        }));
        if (data == null || data == undefined) {
            LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroEquip_Empty, idUserPlayer, "Server");
            data = [];
        }
        var heroEquips = new Other_1.NTArray();
        for (let item of data) {
            var heroEquip = DataModel_1.DataModel.Parse(item);
            heroEquips.Elements.push(heroEquip);
            exports.heroEquipController.SetHeroEquipCached(heroEquip);
        }
        return heroEquips;
    });
}
function CraftFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_CraftFail;
    return message;
}
function WearFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_WearingFail;
    return message;
}
function UnWearFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_UnwearingFail;
    return message;
}
function CreateRandomHeroEquip_White(userPlayerID) {
    return __awaiter(this, void 0, void 0, function* () {
        var maxRate = HeroEquipConfig_1.RateCraft["BlueprintHeroEquip_White"];
        var totalRate = 0;
        var itemData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataItem, ItemCode_1.ItemCode["BlueprintHeroEquip_White"].toString()));
        if (itemData == null)
            return null;
        totalRate += itemData.CraftHeroEquip;
        var rand = Math.random() * maxRate;
        LogController_1.logController.LogDev("1692095948 " + rand + " - " + totalRate + " - " + maxRate);
        if (rand > totalRate)
            return null;
        var code = HeroEquipConfig_1.IndexHeroEquipCraft["BlueprintHeroEquip_White"][Math.floor(Math.random() * HeroEquipConfig_1.IndexHeroEquipCraft["BlueprintHeroEquip_White"].length)];
        LogController_1.logController.LogDev("1692095949 " + code);
        var heroEquipData = DataModel_1.DataModel.Parse(yield DataCenterController_1.dataCenterController.GetDataElementCached(DataVersion_1.dataCenterName.DataHeroEquip, code.toString()));
        var heroEquip = HeroEquip_1.HeroEquip.New(code, new mongoose_1.Types.ObjectId(userPlayerID), heroEquipData.HeroEquipType);
        var newHE = yield AddHeroEquip(heroEquip);
        if (newHE == null || newHE == undefined)
            return null;
        return heroEquip;
    });
}
function AddHeroEquip(heroEquip) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield HeroEquip_1.HeroEquipModel.create(heroEquip).then(res => {
            data = res;
            LogController_1.logController.LogDev("1692095950", res);
            exports.heroEquipController.SetHeroEquipCached(res);
        }).catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_CreateNewFail, err, "Server");
            data = null;
        });
        return data;
    });
}
function UpgradelvFail() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_UpgradeLvFail;
    return message;
}
function CostUpgradeLv(lv, lvRise, start, raise) {
    var result = 0;
    LogController_1.logController.LogDev();
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}
function FindById(idHeroEquip) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroEquip;
        yield HeroEquip_1.HeroEquipModel.findById(idHeroEquip)
            .then(res => {
            if (res == null || res == undefined)
                throw null;
            heroEquip = DataModel_1.DataModel.Parse(res);
            LogController_1.logController.LogDev("1692172948 ", res);
            exports.heroEquipController.SetHeroEquipCached(heroEquip);
            return heroEquip;
        })
            .catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_NotFoundInDB, idHeroEquip, "Server");
            heroEquip = null;
            return heroEquip;
        });
        return heroEquip;
    });
}
function HeroEquipLvUp(heroEquipID, lv) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroEquip;
        yield HeroEquip_1.HeroEquipModel.updateOne({
            _id: heroEquipID
        }, {
            $inc: { Lv: lv }
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1691055268: ", res);
            if (res.modifiedCount == 0 && res.matchedCount == 0) {
                LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_NotFoundInDB, heroEquipID, "Server");
                heroEquip = null;
                return heroEquip;
                ;
            }
            else {
                heroEquip = yield FindById(heroEquipID);
                exports.heroEquipController.SetHeroEquipCached(heroEquip);
                return heroEquip;
            }
        }));
        return heroEquip;
    });
}
function UpdateHeroInHeroEquip(heroEquipID, heroID) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroEquip;
        LogController_1.logController.LogDev("1691055254: ", heroEquipID);
        yield HeroEquip_1.HeroEquipModel.findOne({
            _id: heroEquipID
        }).then(res => {
            LogController_1.logController.LogDev("1692269432 ", res);
        });
        yield HeroEquip_1.HeroEquipModel.updateOne({
            _id: heroEquipID
        }, {
            IdHero: heroID
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("1692269431 ", res);
            if (res.modifiedCount == 0 && res.matchedCount == 0) {
                LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_NotFoundInDB, heroEquipID, "Server");
                heroEquip = null;
                return heroEquip;
            }
            else {
                heroEquip = yield FindById(heroEquipID);
                exports.heroEquipController.SetHeroEquipCached(heroEquip);
                return heroEquip;
            }
        })).catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.HeroEquip_SaveFail, heroEquipID + ": " + err, "Server");
        });
        return heroEquip;
    });
}
