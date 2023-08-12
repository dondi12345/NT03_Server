import redis from 'redis';
import { Message } from "../../MessageServer/Model/Message";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHero, Heroes, FindHeroByIdUserPlayer, Hero, HeroModel, IHero, UpdateHero, HeroUpgradeLv, FindHeroById } from "../Model/Hero";
import { HeroCode } from "../Model/HeroCode";
import { SummonHero, SummonHeroSlot } from "../Model/SummonHero";
import { RateSummon } from "../Model/VariableHero";
import { RedisConfig, RedisKeyConfig } from '../../Enviroment/Env';
import { MessageCode } from '../../MessageServer/Model/MessageCode';
import { SendMessageToSocket } from '../../MessageServer/Service/MessageService';
import { ChangeRes, ResLogin } from '../../Res/Controller/ResController';
import { ResCode } from '../../Res/Model/ResCode';
import { Res } from '../../Res/Model/Res';
import { Types } from 'mongoose';
import { dataHeroDictionary } from '../Service/HeroService';
import { LogType } from '../../LogServer/Model/LogModel';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogUserSocket, logController } from '../../LogServer/Controller/LogController';
import { TransferData } from '../../TransferData';
import { tokenController } from '../../Token/Controller/TockenController';
import { DataModel } from '../../Utils/DataModel';
import { redisControler } from '../../Service/Database/RedisConnect';
import { Currency } from '../../Currency/Model/Currency';
import { currencyController } from '../../Currency/Controller/CurrencyController';
import { dateUtils } from '../../Utils/DateUtils';

const redisHero = redis.createClient({
    host: RedisConfig.Host,
    port: RedisConfig.Port,
    password: RedisConfig.Password,
});

export function HireHero(message: Message, userSocket: IUserSocket) {
    var summonHeroSlot: SummonHeroSlot = SummonHeroSlot.Parse(message.Data);
    redisHero.get(RedisKeyConfig.KeyHeroSummon(userSocket.IdUserPlayer), (error, result) => {
        if (error || result == null || result == undefined) {
            SendMessageToSocket(HireFailMessage(), userSocket.Socket);
            LogUserSocket(LogCode.Hero_HireFail, userSocket, error, LogType.Error)
        } else {
            try {
                var summonHero = DataModel.Parse<SummonHero>(result);
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
                var hero = Hero.Parse(summonHero.Slots[indexFindout].Hero);
                if (hero.Code == HeroCode.Unknown) throw "Don't found hero";
                redisHero.set(RedisKeyConfig.KeyHeroSummon(userSocket.IdUserPlayer), JSON.stringify(summonHero));

                LogUserSocket(LogCode.Hero_HireSuccess, userSocket, "", LogType.Normal)
                HireHeroSuccess(hero, userSocket);
            } catch (error) {
                console.log("Dev 1685284455 " + error)
                LogUserSocket(LogCode.Hero_HireFail, userSocket, error, LogType.Error)
                SendMessageToSocket(HireFailMessage(), userSocket.Socket);
            }
        }
    })
}

export function HireHeroSuccess(hero: IHero, userSocket: IUserSocket) {
    CreateHero(hero).then((res: IHero) => {
        console.log("Dev 1685974556 Adding Hero")
        var message = new Message();
        message.MessageCode = MessageCode.Hero_HireHeroSuccess;
        message.Data = JSON.stringify(hero);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

export function HireFailMessage() {
    var message = new Message();
    message.MessageCode = MessageCode.Hero_HireHeroFail;
    return message
}

export function UpdateHeroes(heroes: Heroes, userSocket: IUserSocket) {
    LogUserSocket(LogCode.Hero_UpdateHero, userSocket, "", LogType.Normal)
    heroes.Elements.forEach(element => {
        UpdateHero(element);
    });

    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpdateHeroes;
    message.Data = JSON.stringify(heroes);
    SendMessageToSocket(message, userSocket.Socket)
}

export function UpdateHeroToClient(hero: Hero, userSocket: UserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpdateHero;
    message.Data = JSON.stringify(hero);
    SendMessageToSocket(message, userSocket.Socket)
}

export function HeroUpgradeLvCtrl(message: Message, userSocket: IUserSocket) {
    var heroUpgradeLv = HeroUpgradeLv.Parse(message.Data);
    FindHeroById(heroUpgradeLv.IdHero).then((res: Hero) => {
        var heroData = dataHeroDictionary[res.Code];
        var cost = HeroCostUpgradeLv(res.Lv, heroUpgradeLv.NumberLv, heroData.CostUpgrade, heroData.CostUpgradeRise);
        if (cost > userSocket.Currency.Food) {
            HeroUpgradeLvFail(userSocket);
        } else {
            userSocket.Currency.Food -= cost;
            res.Lv += heroUpgradeLv.NumberLv;
            var heroes = new Heroes();
            heroes.Elements.push(res);
            UpdateHeroes(heroes, userSocket);
            // UpdateCurrencyCtrl(userSocket);
        }
    })

}

export function HeroUpgradeLvFail(userSocket: IUserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpgradeLvFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function HeroCostUpgradeLv(lv: number, lvRise: number, start: number, raise: number) {
    var result = 0;
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}

class HeroController {
    async Login(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            var message = new Message();
            message.MessageCode = MessageCode.Hero_LoginFail;
            logController.LogWarring(LogCode.Hero_LoginFail, "", transferData.Token);
            transferData.Send(JSON.stringify(message));
            return;
        }
        var heroes = await FindHeroesByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
        logController.LogDev("Dev 1685979990 " + heroes.Elements.length)
        logController.LogMessage(LogCode.Hero_LoginSuccess, "", transferData.Token)
        var message = new Message();
        message.MessageCode = MessageCode.Hero_LoginSuccess;
        message.Data = JSON.stringify(heroes);

        transferData.Send(JSON.stringify(message))
    }

    async Summon(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
            return;
        }
        var currency = DataModel.Parse<Currency>(await currencyController.GetCurrencyCached(transferData.Token));
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
            return;
        }
        if (currency.HeroScroll_White <= 0) {
            logController.LogWarring(LogCode.Hero_NotEnoughtSummon, "", transferData.Token);
            transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
            return;
        }

        currency = await currencyController.AddCurrency({ HeroScroll_White: -1 }, transferData.Token);
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
            return;
        }
        var summonHero = RandomeSummonHero(tokenUserPlayer.IdUserPlayer);

        var messageUpdateCurency = new Message();
        messageUpdateCurency.MessageCode = MessageCode.Currency_Update;
        messageUpdateCurency.Data = JSON.stringify(currency);

        var message = new Message();
        message.MessageCode = MessageCode.Hero_SummonSuccess
        message.Data = JSON.stringify(summonHero);
        transferData.Send(JSON.stringify(messageUpdateCurency), JSON.stringify(message));
    }

    async GetSummonResult(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            var message = new Message();
            message.MessageCode = MessageCode.Hero_GetSummonResultFail
            transferData.Send(JSON.stringify(SummonFail(transferData.Token)));
            return;
        }
        var summonHero = DataModel.Parse<DataModel>(await redisControler.Get(RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer)))

        if (summonHero == null || summonHero == undefined) {
            logController.LogWarring(LogCode.Hero_GetSummonResultFail, "", transferData.Token);
            var message = new Message();
            message.MessageCode = MessageCode.Hero_SendSummonResult;
            message.Data = JSON.stringify(summonHero);
            transferData.Send(JSON.stringify(message))
            return;
        }

        logController.LogMessage(LogCode.Hero_GetSummonResultSuc, "", transferData.Token);
        var message = new Message();
        message.MessageCode = MessageCode.Hero_SendSummonResult;
        message.Data = JSON.stringify(summonHero);
        transferData.Send(JSON.stringify(message))
    }

    async HireHero(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(JSON.stringify(HireFail()));
            return;
        }
        var summonHeroSlot = DataModel.Parse<SummonHeroSlot>(message.Data);
        var summonHero = DataModel.Parse<SummonHero>(await redisControler.Get(RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer)))
        if(summonHeroSlot == null || summonHeroSlot == undefined || summonHero == null || summonHero == undefined){
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
        if(indexFindout == -1){
            logController.LogError(LogCode.Hero_HireFail, "Not Found", transferData.Token);
            transferData.Send(JSON.stringify(HireFail()));
            return;
        }
        var hero = DataModel.Parse<Hero>(summonHero.Slots[indexFindout].Hero);
        if(hero == null || hero == undefined || hero.Code == HeroCode.Unknown){
            logController.LogError(LogCode.Hero_HireFail, "Fail Parse", transferData.Token);
            transferData.Send(JSON.stringify(HireFail()));
            return;
        }
        redisControler.Set(RedisKeyConfig.KeyHeroSummon(tokenUserPlayer.IdUserPlayer), JSON.stringify(summonHero));
        var heroNew = await CreateNewHero(hero, transferData.Token);

        var messageHero = new Message();
        messageHero.MessageCode = MessageCode.Hero_SummonSuccess;
        messageHero.Data = JSON.stringify(heroNew);

        var messageResult = new Message();
        messageResult.MessageCode = MessageCode.Hero_SendSummonResult;
        messageResult.Data = JSON.stringify(summonHero)

        transferData.Send(JSON.stringify(messageHero), JSON.stringify(messageResult));
    }
}

export const heroController = new HeroController();

function SummonFail(token) {
    var message = new Message();
    message.MessageCode = MessageCode.Hero_SummonFail;
    logController.LogWarring(LogCode.Hero_SummonFail, "", token)
    return message;
}

async function FindHeroesByIdUserPlayer(idUserPlayer: string) {
    var data;
    await HeroModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
        data = res;
        logController.LogDev("1691833750 Dev ", res)
    }).catch(async err => {
        logController.LogError(LogCode.Hero_CreateFail, idUserPlayer + ":" + err, "Server");
    })
    if (data == null || data == undefined) {
        logController.LogWarring(LogCode.Hero_Empty, idUserPlayer, "Server");
        data = []
    }
    var dataHeroes = new Heroes();
    for (let item of data) {
        var hero = DataModel.Parse<Hero>(item);
        dataHeroes.Elements.push(hero);
        redisControler.Set(RedisKeyConfig.KeyHeroData(idUserPlayer, hero._id), JSON.stringify(hero));
    }
    return dataHeroes;
}

function RandomeSummonHero(idUserPlayer, rank = 0) {
    var rateSummon = RateSummon[rank]
    var totalRate = 0;
    for (let property in rateSummon) {
        totalRate += rateSummon[property];
    }
    var summonHero = new SummonHero();
    summonHero.Version = dateUtils.GetCurrentDateNumber().toString();
    summonHero.Slots = [];
    for (let index = 0; index < 7; index++) {
        var rate = Math.floor(Math.random() * totalRate);

        for (let property in rateSummon) {
            if (rate < rateSummon[property]) {
                var summonHeroSlot = new SummonHeroSlot();
                var hero: Hero = new Hero();
                hero.InitData(idUserPlayer, HeroCode[property])
                summonHeroSlot.Hero = hero;
                summonHeroSlot.Hired = false;
                summonHero.Slots.push(summonHeroSlot);
                break;
            }
            rate -= rateSummon[property];
        }
    }
    redisHero.set(RedisKeyConfig.KeyHeroSummon(idUserPlayer), JSON.stringify(summonHero));
    return summonHero;
}

function HireFail(){
    var message = new Message();
    message.MessageCode = MessageCode.Hero_HireHeroFail;
    return message;
}

async function CreateNewHero(hero : Hero, token){
    var data;
    await HeroModel.create(hero).then(res=>{
        logController.LogMessage(LogCode.Hero_CreateSuc, res, token)
        data = res;
    }).catch(err=>{
        logController.LogError(LogCode.Hero_CreateFail, err, token);
        data = null;
    })
    return DataModel.Parse<Hero>(data);
}