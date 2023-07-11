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
exports.HeroEquipCostUpgradeLv = exports.HeroEquipUpgradeLvFail = exports.HeroEquipUpgradeLvCtrl = exports.UpdateHeroEquips = exports.UnwearingEquipFail = exports.UnwearingEquip = exports.WearingEquipFail = exports.WearingEquip = exports.RandomHeroEquip = exports.CraftEquip = exports.HeroEquipLogin = void 0;
const mongoose_1 = require("mongoose");
const HeroController_1 = require("../../HeroServer/Controller/HeroController");
const Hero_1 = require("../../HeroServer/Model/Hero");
const HeroCode_1 = require("../../HeroServer/Model/HeroCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const ResController_1 = require("../../Res/Controller/ResController");
const ResCode_1 = require("../../Res/Model/ResCode");
const ResService_1 = require("../../Res/Service/ResService");
const HeroEquip_1 = require("../Model/HeroEquip");
const HeroEquipType_1 = require("../Model/HeroEquipType");
const VariableHeroEquip_1 = require("../Model/VariableHeroEquip");
const HeroEquipService_1 = require("../Service/HeroEquipService");
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
function HeroEquipLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, HeroEquip_1.FindHeroEquipByIdUserPlayer)(userSocket.IdUserPlayer).then((respone) => __awaiter(this, void 0, void 0, function* () {
            var heroEquips = new HeroEquip_1.HeroEquips;
            for (const item of respone) {
                var heroEquip = HeroEquip_1.HeroEquip.Parse(item);
                heroEquips.Elements.push(heroEquip);
            }
            console.log("Dev 1685514345 " + respone.length);
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroEquip_LoginSuccess;
            message.Data = JSON.stringify(heroEquips);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        })).catch(e => {
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroEquip_LoginFail;
            message.Data = "HeroEquip login fail";
            console.log("Dev 1685514350 " + e);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        });
    });
}
exports.HeroEquipLogin = HeroEquipLogin;
// 10f;80f;800f;10000f;100000f;1000000f;1000000f;
function CraftEquip(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var craftHeroEquip = HeroEquip_1.CraftHeroEquip.Parse(message.Data);
        (0, ResController_1.ChangeRes)(craftHeroEquip.ResCode, -1, userSocket).then(respone => {
            console.log("Dev 1686209545 " + respone);
            if (respone) {
                RandomHeroEquip(craftHeroEquip, userSocket);
            }
            else {
                CraftHeroEquipFail(userSocket);
            }
        });
    });
}
exports.CraftEquip = CraftEquip;
function RandomHeroEquip(craftHeroEquip, userSocket) {
    var maxRate = VariableHeroEquip_1.RateCraft[ResCode_1.ResCode[craftHeroEquip.ResCode]];
    var totalRate = 0;
    totalRate += ResService_1.DataResService[craftHeroEquip.ResCode].CraftHeroEquip;
    var rand = Math.random() * maxRate;
    console.log(rand + " - " + totalRate + " - " + maxRate);
    if (rand > totalRate) {
        CraftHeroEquipFail(userSocket);
        return;
    }
    VariableHeroEquip_1.IndexHeroEquipCraft[ResCode_1.ResCode[craftHeroEquip.ResCode]];
    var code = VariableHeroEquip_1.IndexHeroEquipCraft[ResCode_1.ResCode[craftHeroEquip.ResCode]][Math.floor(Math.random() * VariableHeroEquip_1.IndexHeroEquipCraft[ResCode_1.ResCode[craftHeroEquip.ResCode]].length)];
    var heroEquip = new HeroEquip_1.HeroEquip();
    heroEquip = HeroEquip_1.HeroEquip.HeroEquip(code, userSocket.IdUserPlayer);
    (0, HeroEquip_1.CreateHeroEquip)(heroEquip).then(respone => {
        if (respone == null || respone == undefined) {
            CraftHeroEquipFail(userSocket);
            return;
        }
        var newEquip = HeroEquip_1.HeroEquip.Parse(respone);
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.HeroEquip_CraftSuccess;
        message.Data = JSON.stringify(newEquip);
        (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
    }).catch(e => {
        console.log("Dev 1686210916 " + e);
        CraftHeroEquipFail(userSocket);
        return;
    });
}
exports.RandomHeroEquip = RandomHeroEquip;
function CraftHeroEquipFail(userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_CraftFail;
    message.Data = "Craft Fail";
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
function WearingEquip(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroeEquipsUpdate = new HeroEquip_1.HeroEquips();
        var heroesUpdate = new Hero_1.Heroes();
        var heroWearEquip = HeroEquip_1.HeroWearEquip.Parse(message.Data);
        var hero = new Hero_1.Hero();
        yield (0, Hero_1.FindHeroById)(heroWearEquip.IdHero).then(res => {
            hero = res;
        });
        if (hero == null || hero == undefined || hero.Code == HeroCode_1.HeroCode.Unknown) {
            WearingEquipFail(userSocket);
            return;
        }
        var heroEquips = [];
        for (let index = 0; index < heroWearEquip.IdHeroEquips.length; index++) {
            const element = heroWearEquip.IdHeroEquips[index];
            yield (0, HeroEquip_1.FindHeroEquipById)(element).then(res => {
                if (res == null || res == undefined)
                    return;
                heroEquips.push(res);
            });
        }
        if (heroEquips.length == 0) {
            WearingEquipFail(userSocket);
            return;
        }
        for (let index = 0; index < heroEquips.length; index++) {
            const element = heroEquips[index];
            switch (element.Type) {
                case HeroEquipType_1.HeroEquipType.Weapon:
                    if (hero.Gear.IdWeapon != null && hero.Gear.IdWeapon != undefined) {
                        yield (0, HeroEquip_1.FindHeroEquipById)(new mongoose_1.Types.ObjectId(hero.Gear.IdWeapon)).then((res) => {
                            if (res == null || res == undefined)
                                return;
                            res.IdHero = "";
                            heroeEquipsUpdate.Elements.push(res);
                        });
                    }
                    hero.Gear.IdWeapon = element._id.toString();
                    element.IdHero = hero._id.toString();
                    heroeEquipsUpdate.Elements.push(element);
                    break;
                case HeroEquipType_1.HeroEquipType.Armor:
                    if (hero.Gear.IdArmor != null && hero.Gear.IdArmor != undefined) {
                        yield (0, HeroEquip_1.FindHeroEquipById)(new mongoose_1.Types.ObjectId(hero.Gear.IdArmor)).then((res) => {
                            if (res == null || res == undefined)
                                return;
                            res.IdHero = "";
                            heroeEquipsUpdate.Elements.push(res);
                        });
                    }
                    hero.Gear.IdArmor = element._id.toString();
                    element.IdHero = hero._id.toString();
                    heroeEquipsUpdate.Elements.push(element);
                    break;
                case HeroEquipType_1.HeroEquipType.Helmet:
                    if (hero.Gear.IdHelmet != null && hero.Gear.IdHelmet != undefined) {
                        yield (0, HeroEquip_1.FindHeroEquipById)(new mongoose_1.Types.ObjectId(hero.Gear.IdHelmet)).then((res) => {
                            if (res == null || res == undefined)
                                return;
                            res.IdHero = "";
                            heroeEquipsUpdate.Elements.push(res);
                        });
                    }
                    hero.Gear.IdHelmet = element._id.toString();
                    element.IdHero = hero._id.toHexString();
                    heroeEquipsUpdate.Elements.push(element);
                    break;
            }
        }
        heroesUpdate.Elements.push(hero);
        (0, HeroController_1.UpdateHeroes)(heroesUpdate, userSocket);
        UpdateHeroEquips(heroeEquipsUpdate, userSocket);
    });
}
exports.WearingEquip = WearingEquip;
function WearingEquipFail(userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_WearingFail;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.WearingEquipFail = WearingEquipFail;
function UnwearingEquip(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroeEquipsUpdate = new HeroEquip_1.HeroEquips();
        var heroesUpdate = new Hero_1.Heroes();
        var heroWearEquip = HeroEquip_1.HeroWearEquip.Parse(message.Data);
        var hero;
        yield (0, Hero_1.FindHeroById)(heroWearEquip.IdHero).then(res => {
            hero = res;
        });
        if (hero == null || hero == undefined) {
            UnwearingEquipFail(userSocket);
            return;
        }
        var heroEquips = [];
        for (let index = 0; index < heroWearEquip.IdHeroEquips.length; index++) {
            const element = heroWearEquip.IdHeroEquips[index];
            yield (0, HeroEquip_1.FindHeroEquipById)(element).then(res => {
                if (res == null || res == undefined)
                    return;
                heroEquips.push(res);
            });
        }
        if (heroEquips.length == 0) {
            WearingEquipFail(userSocket);
            return;
        }
        for (let index = 0; index < heroEquips.length; index++) {
            const element = heroEquips[index];
            if (element.Type == HeroEquipType_1.HeroEquipType.Weapon) {
                hero.Gear.IdWeapon = undefined;
                element.IdHero = "";
                heroeEquipsUpdate.Elements.push(element);
            }
            if (element.Type == HeroEquipType_1.HeroEquipType.Armor) {
                hero.Gear.IdArmor = undefined;
                element.IdHero = "";
                heroeEquipsUpdate.Elements.push(element);
            }
            if (element.Type == HeroEquipType_1.HeroEquipType.Helmet) {
                hero.Gear.IdHelmet = undefined;
                element.IdHero = "";
                heroeEquipsUpdate.Elements.push(element);
            }
        }
        heroesUpdate.Elements.push(hero);
        (0, HeroController_1.UpdateHeroes)(heroesUpdate, userSocket);
        UpdateHeroEquips(heroeEquipsUpdate, userSocket);
    });
}
exports.UnwearingEquip = UnwearingEquip;
function UnwearingEquipFail(userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_UnwearingFail;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.UnwearingEquipFail = UnwearingEquipFail;
function UpdateHeroEquips(heroEquips, userSocket) {
    heroEquips.Elements.forEach(element => {
        (0, HeroEquip_1.UpdateHeroEquip)(element);
    });
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_UpdateEquips;
    message.Data = JSON.stringify(heroEquips);
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.UpdateHeroEquips = UpdateHeroEquips;
function HeroEquipUpgradeLvCtrl(message, userSocket) {
    var heroEquipUpgradeLv = HeroEquip_1.HeroEquipUpgradeLv.Parse(message.Data);
    (0, HeroEquip_1.FindHeroEquipById)(heroEquipUpgradeLv.IdEquip).then((res) => {
        var heroEquipData = HeroEquipService_1.dataHeroEquipDictionary[res.Code];
        var cost = HeroEquipCostUpgradeLv(res.Lv, heroEquipUpgradeLv.NumberLv, heroEquipData.CostUpgrade, heroEquipData.CostUpgradeRise);
        if (cost > userSocket.Currency.Money) {
            HeroEquipUpgradeLvFail(userSocket);
        }
        else {
            userSocket.Currency.Money -= cost;
            res.Lv += heroEquipUpgradeLv.NumberLv;
            var heroeEquips = new HeroEquip_1.HeroEquips();
            heroeEquips.Elements.push(res);
            UpdateHeroEquips(heroeEquips, userSocket);
            (0, CurrencyController_1.UpdateCurrencyCtrl)(userSocket);
        }
    });
}
exports.HeroEquipUpgradeLvCtrl = HeroEquipUpgradeLvCtrl;
function HeroEquipUpgradeLvFail(userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroEquip_UpgradeLvFail;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.HeroEquipUpgradeLvFail = HeroEquipUpgradeLvFail;
function HeroEquipCostUpgradeLv(lv, lvRise, start, raise) {
    var result = 0;
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}
exports.HeroEquipCostUpgradeLv = HeroEquipCostUpgradeLv;
