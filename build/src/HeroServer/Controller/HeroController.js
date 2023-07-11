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
exports.HeroCostUpgradeLv = exports.HeroUpgradeLvFail = exports.HeroUpgradeLvCtrl = exports.UpdateHeroes = exports.HireFailMessage = exports.HireHeroSuccess = exports.HireHero = exports.GetSummonResult = exports.RandomeHero = exports.Summon = exports.HeroLogin = exports.CreateNewHero = void 0;
const redis_1 = __importDefault(require("redis"));
const Message_1 = require("../../MessageServer/Model/Message");
const Hero_1 = require("../Model/Hero");
const HeroCode_1 = require("../Model/HeroCode");
const SummonHero_1 = require("../Model/SummonHero");
const VariableHero_1 = require("../Model/VariableHero");
const Env_1 = require("../../Enviroment/Env");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const ResController_1 = require("../../Res/Controller/ResController");
const ResCode_1 = require("../../Res/Model/ResCode");
const HeroService_1 = require("../Service/HeroService");
const CurrencyController_1 = require("../../Currency/Controller/CurrencyController");
const redisHero = redis_1.default.createClient();
function CreateNewHero() {
    for (let index = 0; index < 10; index++) {
        var hero = new Hero_1.Hero();
        console.log(JSON.stringify(hero));
    }
}
exports.CreateNewHero = CreateNewHero;
function HeroLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, Hero_1.FindHeroByIdUserPlayer)(userSocket.IdUserPlayer).then((respone) => __awaiter(this, void 0, void 0, function* () {
            var dataHeroes = new Hero_1.Heroes();
            for (let item of respone) {
                var hero = Hero_1.Hero.Parse(item);
                dataHeroes.Elements.push(hero);
            }
            console.log("Dev 1685979990 " + dataHeroes.Elements.length);
            if (dataHeroes.Elements.length > 0)
                console.log("Dev 1685293708 " + JSON.stringify(dataHeroes.Elements[0]));
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_LoginSuccess;
            message.Data = JSON.stringify(dataHeroes);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        })).catch(e => {
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_LoginFail;
            message.Data = "Hero login fail";
            console.log("Dev 1685293337 " + e);
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        });
    });
}
exports.HeroLogin = HeroLogin;
function Summon(message, userSocket) {
    if (userSocket.Currency == null || userSocket.Currency == undefined) {
        (0, ResController_1.ResLogin)(new Message_1.Message(), userSocket);
        console.log("Dev 1685287568 Not connect to Res");
        return;
    }
    (0, ResController_1.ChangeRes)(ResCode_1.ResCode.HeroScroll_White, -1, userSocket).then(respone => {
        console.log("Dev 1686208980 " + respone);
        if (respone) {
            RandomeHero(userSocket);
        }
        else {
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.Hero_SummonFail;
            message.Data = "Dont enough HeroScroll";
            (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
        }
    });
}
exports.Summon = Summon;
function RandomeHero(userSocket) {
    var rateSummon = VariableHero_1.RateSummon[0];
    var totalRate = 0;
    for (let property in rateSummon) {
        totalRate += rateSummon[property];
    }
    var summonHero = new SummonHero_1.SummonHero();
    summonHero.IdUserPlayer = userSocket.IdUserPlayer;
    summonHero.Slots = [];
    for (let index = 0; index < 7; index++) {
        var rate = Math.floor(Math.random() * totalRate);
        for (let property in rateSummon) {
            if (rate < rateSummon[property]) {
                var summonHeroSlot = new SummonHero_1.SummonHeroSlot();
                var hero = Hero_1.Hero.NewHero({ IdUserPlayer: userSocket.IdUserPlayer, HeroCode: HeroCode_1.HeroCode[property] });
                summonHeroSlot.Hero = hero;
                summonHeroSlot.Hired = false;
                summonHero.Slots.push(summonHeroSlot);
                break;
            }
            rate -= rateSummon[property];
        }
    }
    redisHero.set(Env_1.Redis.KeyHeroSummon + userSocket.IdUserPlayer, JSON.stringify(summonHero));
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_SummonSuccess;
    message.Data = JSON.stringify(summonHero);
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.RandomeHero = RandomeHero;
function GetSummonResult(message, userSocket) {
    redisHero.get(Env_1.Redis.KeyHeroSummon + userSocket.IdUserPlayer, (error, result) => {
        var data;
        if (error || result == null || result == undefined) {
            data = {};
        }
        else {
            data = result;
        }
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.Hero_SendSummonResult;
        message.Data = data;
        console.log(data);
        (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
    });
}
exports.GetSummonResult = GetSummonResult;
function HireHero(message, userSocket) {
    var summonHeroSlot = SummonHero_1.SummonHeroSlot.Parse(message.Data);
    redisHero.get(Env_1.Redis.KeyHeroSummon + userSocket.IdUserPlayer, (error, result) => {
        if (error || result == null || result == undefined) {
            (0, MessageService_1.SendMessageToSocket)(HireFailMessage(), userSocket.Socket);
        }
        else {
            try {
                var summonHero = SummonHero_1.SummonHero.Parse(result);
                var indexFindout = -1;
                for (let index = 0; index < summonHero.Slots.length; index++) {
                    const element = summonHero.Slots[index];
                    console.log("Dev 1685507029 " + element._id.toString() + " - " + summonHeroSlot._id.toString());
                    if (element._id.toString() === summonHeroSlot._id.toString()) {
                        element.Hired = true;
                        indexFindout = index;
                        break;
                    }
                }
                redisHero.set(Env_1.Redis.KeyHeroSummon + userSocket.IdUserPlayer, JSON.stringify(summonHero));
                var hero = Hero_1.Hero.NewHero(summonHero.Slots[indexFindout].Hero);
                HireHeroSuccess(hero, userSocket);
            }
            catch (error) {
                console.log("Dev 1685284455 " + error);
                (0, MessageService_1.SendMessageToSocket)(HireFailMessage(), userSocket.Socket);
            }
        }
    });
}
exports.HireHero = HireHero;
function HireHeroSuccess(hero, userSocket) {
    (0, Hero_1.CreateHero)(hero).then((res) => {
        console.log("Dev 1685974556 Adding Hero");
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.Hero_HireHeroSuccess;
        message.Data = JSON.stringify(hero);
        (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
    });
}
exports.HireHeroSuccess = HireHeroSuccess;
function HireFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_HireHeroFail;
    return message;
}
exports.HireFailMessage = HireFailMessage;
function UpdateHeroes(heroes, userSocket) {
    heroes.Elements.forEach(element => {
        (0, Hero_1.UpdateHero)(element);
    });
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_UpdateHeroes;
    message.Data = JSON.stringify(heroes);
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.UpdateHeroes = UpdateHeroes;
function HeroUpgradeLvCtrl(message, userSocket) {
    var heroUpgradeLv = Hero_1.HeroUpgradeLv.Parse(message.Data);
    (0, Hero_1.FindHeroById)(heroUpgradeLv.IdHero).then((res) => {
        var heroData = HeroService_1.dataHeroDictionary[res.Code];
        var cost = HeroCostUpgradeLv(res.Lv, heroUpgradeLv.NumberLv, heroData.CostUpgrade, heroData.CostUpgradeRise);
        if (cost > userSocket.Currency.Food) {
            HeroUpgradeLvFail(userSocket);
        }
        else {
            userSocket.Currency.Food -= cost;
            res.Lv += heroUpgradeLv.NumberLv;
            var heroes = new Hero_1.Heroes();
            heroes.Elements.push(res);
            UpdateHeroes(heroes, userSocket);
            (0, CurrencyController_1.UpdateCurrencyCtrl)(userSocket);
        }
    });
}
exports.HeroUpgradeLvCtrl = HeroUpgradeLvCtrl;
function HeroUpgradeLvFail(userSocket) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Hero_UpgradeLvFail;
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.HeroUpgradeLvFail = HeroUpgradeLvFail;
function HeroCostUpgradeLv(lv, lvRise, start, raise) {
    var result = 0;
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}
exports.HeroCostUpgradeLv = HeroCostUpgradeLv;
