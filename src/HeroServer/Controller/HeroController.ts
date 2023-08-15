import { Message } from "../../MessageServer/Model/Message";
import { Heroes, Hero, HeroModel, HeroUpgradeLv, HeroData } from "../Model/Hero";
import { HeroCode } from "../Model/HeroCode";
import { SummonHero, SummonHeroSlot } from "../Model/SummonHero";
import { RateSummon } from "../Model/VariableHero";
import { RedisKeyConfig } from '../../Enviroment/Env';
import { MessageCode } from '../../MessageServer/Model/MessageCode';
import { LogCode } from '../../LogServer/Model/LogCode';
import { logController } from '../../LogServer/Controller/LogController';
import { TransferData } from '../../TransferData';
import { tokenController } from '../../Token/Controller/TockenController';
import { DataModel } from '../../Utils/DataModel';
import { redisControler } from '../../Service/Database/RedisConnect';
import { Currency } from '../../Currency/Model/Currency';
import { currencyController } from '../../Currency/Controller/CurrencyController';
import { dateUtils } from '../../Utils/DateUtils';
import { dataCenterName } from '../../DataCenter/Model/DataVersion';

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
        var currency = DataModel.Parse<Currency>(await currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer));
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

    async UpgradeLv(message : Message, transferData : TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }
        var heroUpgradeLv = DataModel.Parse<HeroUpgradeLv>(message.Data);
        var hero = DataModel.Parse<Hero>(await redisControler.Get(RedisKeyConfig.KeyHeroData(tokenUserPlayer.IdUserPlayer, heroUpgradeLv.IdHero)));
        if(hero == null || hero == undefined){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "Not found hero in cache", transferData.Token);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }
        var heroData = DataModel.Parse<HeroData>(await redisControler.Get(RedisKeyConfig.KeyDataCenterElement(dataCenterName.DataHero, hero.Code.toString())));
        if(heroData == null || heroData == undefined){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "Not found heroData in cache", transferData.Token);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }

        var cost = HeroCostUpgradeLv(hero.Lv, heroUpgradeLv.NumberLv, heroData.CostUpgrade, heroData.CostUpgradeRise);

        var currency = DataModel.Parse<Currency>(await redisControler.Get(RedisKeyConfig.KeyCurrencyData(tokenUserPlayer.IdUserPlayer)));
        if(currency == null || currency == undefined){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "Not found currency in cache", transferData.Token);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }

        if(currency.Food < cost){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "Not currency don't enought", transferData.Token);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }

        hero = await HeroLvUp(heroUpgradeLv.IdHero, heroUpgradeLv.NumberLv);
        if(hero == null || hero == undefined){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "HeroLvUp Fail", transferData.Token);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }
        currency = await currencyController.AddCurrency({Food : -cost}, transferData.Token);
        if(currency == null || currency == undefined){
            logController.LogError(LogCode.Hero_UpgradeLvFail, "Currency update Fail", transferData.Token);
            await HeroLvUp(heroUpgradeLv.IdHero, -heroUpgradeLv.NumberLv);
            transferData.Send(JSON.stringify(UpgradeFail()));
            return;
        }

        var messageUdHero = new Message();
        messageUdHero.MessageCode = MessageCode.Hero_UpdateHero;
        messageUdHero.Data = JSON.stringify(hero);

        var messageUdCurrency = new Message();
        messageUdCurrency.MessageCode = MessageCode.Currency_Update;
        messageUdCurrency.Data = JSON.stringify(currency);

        transferData.Send(JSON.stringify(messageUdHero), JSON.stringify(messageUdCurrency))
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
        logController.LogError(LogCode.Hero_NotFoundInDB, idUserPlayer + ":" + err, "Server");
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
    redisControler.Set(RedisKeyConfig.KeyHeroSummon(idUserPlayer), JSON.stringify(summonHero))
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

function UpgradeFail(){
    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpgradeLvFail;
    return message;
}

function HeroCostUpgradeLv(lv: number, lvRise: number, start: number, raise: number) {
    var result = 0;
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}

async function HeroLvUp(idHero, lv){
    var hero;
        await HeroModel.updateOne(
        {
            _id : idHero
        },
        {
            $inc :{ Lv : lv}
        }
    ).then(async res => {
        logController.LogMessage(LogCode.Hero_HeroLvUpSuc, res, idHero);
        if (res.modifiedCount == 0) {
            logController.LogError(LogCode.Hero_HeroLvUpFail,idHero, "Server");
            hero = null;
            return hero;
        } else {
            hero = await FindById(idHero);
            return hero;
        }
    }).catch(err => {
        logController.LogWarring(LogCode.Hero_HeroLvUpFail, err, "Server");
        return null;
    })
    return hero
}

async function FindById(idHero){
    var hero;
    await HeroModel.find({_id : idHero})
    .then(res=>{
        hero = res
        return hero;
    })
    .catch(err=>{
        logController.LogError(LogCode.Hero_NotFoundInDB,idHero, "Server");
        hero = null;
        return hero;
    })
    return hero;
}