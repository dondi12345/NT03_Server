import redis from 'redis';
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHero, Heroes, FindHeroByIdUserPlayer, Hero, HeroModel, IHero, UpdateHero, HeroUpgradeLv, FindHeroById } from "../Model/Hero";
import { HeroCode } from "../Model/HeroCode";
import { ISummonHero, ISummonHeroSlot, SummonHero, SummonHeroSlot } from "../Model/SummonHero";
import { RateSummon } from "../Model/VariableHero";
import { Redis } from '../../Enviroment/Env';
import { MessageCode } from '../../MessageServer/Model/MessageCode';
import { SendMessageToSocket } from '../../MessageServer/Service/MessageService';
import { ChangeRes, ResLogin } from '../../Res/Controller/ResController';
import { ResCode } from '../../Res/Model/ResCode';
import { Res } from '../../Res/Model/Res';
import { Types } from 'mongoose';
import { dataHeroDictionary } from '../Service/HeroService';
import { UpdateCurrencyCtrl } from '../../Currency/Controller/CurrencyController';
import { LogType } from '../../LogServer/Model/LogModel';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogUserSocket } from '../../LogServer/Controller/LogController';

const redisHero = redis.createClient();

export function CreateNewHero(){
    for (let index = 0; index < 10; index++) {
        var hero = new Hero();
        console.log(JSON.stringify(hero));
        
    }
}

export async function HeroLogin(message : IMessage, userSocket: IUserSocket){
    await FindHeroByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        var dataHeroes = new Heroes();
        for (let item of respone) {
            var hero = Hero.Parse(item);
            dataHeroes.Elements.push(hero);
        }
        console.log("Dev 1685979990 "+ dataHeroes.Elements.length);
        if(dataHeroes.Elements.length > 0) console.log("Dev 1685293708 "+JSON.stringify(dataHeroes.Elements[0]))
        var message = new Message();
        message.MessageCode = MessageCode.Hero_LoginSuccess;
        message.Data = JSON.stringify(dataHeroes);
        SendMessageToSocket(message, userSocket.Socket);
        LogUserSocket(LogCode.Hero_LoginSuccess, userSocket, "", LogType.Normal)
    }).catch(e=>{
        var message = new Message();
        message.MessageCode = MessageCode.Hero_LoginFail;
        message.Data = "Hero login fail";
        console.log("Dev 1685293337 "+ e);
        LogUserSocket(LogCode.Hero_LoginFail, userSocket, e, LogType.Error)
        SendMessageToSocket(message, userSocket.Socket);
    })
}

export function Summon(message : IMessage, userSocket: IUserSocket){
    if(userSocket.Currency == null || userSocket.Currency == undefined){
        ResLogin(new Message(), userSocket);
        LogUserSocket(LogCode.Hero_DontLoginRes, userSocket, "Hero_DontLoginRes", LogType.Error)
        console.log("Dev 1685287568 Not connect to Res")
        return;
    }
    ChangeRes(ResCode.HeroScroll_White, -1, userSocket).then(respone=>{
        console.log("Dev 1686208980 "+ respone);
        if(respone){
            RandomeHero(userSocket);
        }else{
            var message = new Message();
            message.MessageCode = MessageCode.Hero_SummonFail;
            message.Data = "Dont enough HeroScroll";
            SendMessageToSocket(message, userSocket.Socket);
            LogUserSocket(LogCode.Hero_DontEnoughHeroScroll, userSocket, "", LogType.Warning)
        }
    });
}

export function RandomeHero(userSocket: IUserSocket){
    var rateSummon = RateSummon[0]
    var totalRate = 0;
    for (let property in rateSummon) {
        totalRate += rateSummon[property];
    }
    var summonHero = new SummonHero();
    summonHero.IdUserPlayer = userSocket.IdUserPlayer;
    summonHero.Slots = [];
    for (let index = 0; index < 7; index++) {
        var rate = Math.floor(Math.random()*totalRate);
        
        for (let property in rateSummon) {
            if(rate < rateSummon[property]){
                var summonHeroSlot = new SummonHeroSlot();
                var hero : Hero = Hero.NewHero({IdUserPlayer : userSocket.IdUserPlayer, HeroCode : HeroCode[property]})
                summonHeroSlot.Hero = hero;
                summonHeroSlot.Hired = false;
                summonHero.Slots.push(summonHeroSlot);
                break;
            }
            rate -= rateSummon[property];
        }
    }
    redisHero.set(Redis.KeyHeroSummon+userSocket.IdUserPlayer, JSON.stringify(summonHero));
    var message = new Message();
    message.MessageCode = MessageCode.Hero_SummonSuccess;
    message.Data = JSON.stringify(summonHero);
    SendMessageToSocket(message, userSocket.Socket);
    LogUserSocket(LogCode.Hero_SummonSuccess, userSocket, "", LogType.Normal)
}

export function GetSummonResult(message : IMessage, userSocket: IUserSocket){
    redisHero.get(Redis.KeyHeroSummon + userSocket.IdUserPlayer,  (error, result)=>{
        var data;
        if(error || result == null || result == undefined){
            data = {};
        }else{
            data = result;
        }
        var message = new Message();
        message.MessageCode = MessageCode.Hero_SendSummonResult;
        message.Data = data;
        console.log(data);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

export function HireHero(message : IMessage, userSocket: IUserSocket){
    var summonHeroSlot : SummonHeroSlot = SummonHeroSlot.Parse(message.Data);
    redisHero.get(Redis.KeyHeroSummon + userSocket.IdUserPlayer,  (error, result)=>{
        if(error || result == null || result == undefined){
            SendMessageToSocket(HireFailMessage(), userSocket.Socket);
            LogUserSocket(LogCode.Hero_HireFail, userSocket, error, LogType.Error)
        }else{
            try {
                var summonHero = SummonHero.Parse(result);
                var indexFindout = -1;
                for (let index = 0; index < summonHero.Slots.length; index++) {
                    const element = summonHero.Slots[index];
                    console.log("Dev 1685507029 "+ element._id.toString() + " - "+summonHeroSlot._id.toString());
                    if(element._id.toString() === summonHeroSlot._id.toString()){
                        element.Hired = true;
                        indexFindout = index;
                        break;
                    }
                }
                redisHero.set(Redis.KeyHeroSummon+userSocket.IdUserPlayer, JSON.stringify(summonHero));

                var hero = Hero.NewHero(summonHero.Slots[indexFindout].Hero);
                LogUserSocket(LogCode.Hero_HireSuccess, userSocket, "", LogType.Normal)
                HireHeroSuccess(hero, userSocket);
            } catch (error) {
                console.log("Dev 1685284455 "+error)
                LogUserSocket(LogCode.Hero_HireFail, userSocket, error, LogType.Error)
                SendMessageToSocket(HireFailMessage(), userSocket.Socket); 
            }
        }
    })
}

export function HireHeroSuccess(hero : IHero, userSocket: IUserSocket){
    CreateHero(hero).then((res : IHero)=>{
        console.log("Dev 1685974556 Adding Hero")
        var message = new Message();
        message.MessageCode = MessageCode.Hero_HireHeroSuccess;
        message.Data = JSON.stringify(hero);
        SendMessageToSocket(message, userSocket.Socket); 
    })
}

export function HireFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.Hero_HireHeroFail;
    return message
}

export function UpdateHeroes(heroes : Heroes, userSocket: IUserSocket){
    LogUserSocket(LogCode.Hero_UpdateHero, userSocket, "", LogType.Normal)
    heroes.Elements.forEach(element => {
        UpdateHero(element);
    });

    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpdateHeroes;
    message.Data = JSON.stringify(heroes);
    SendMessageToSocket(message, userSocket.Socket)
}

export function HeroUpgradeLvCtrl(message : Message, userSocket : IUserSocket){
    var heroUpgradeLv = HeroUpgradeLv.Parse(message.Data);
    FindHeroById(heroUpgradeLv.IdHero).then((res : Hero)=>{
        var heroData = dataHeroDictionary[res.Code];
        var cost = HeroCostUpgradeLv(res.Lv, heroUpgradeLv.NumberLv, heroData.CostUpgrade, heroData.CostUpgradeRise);
        if(cost > userSocket.Currency.Food){
            HeroUpgradeLvFail(userSocket);
        }else{
            userSocket.Currency.Food -= cost;
            res.Lv += heroUpgradeLv.NumberLv;
            var heroes = new Heroes();
            heroes.Elements.push(res);
            UpdateHeroes(heroes, userSocket);
            UpdateCurrencyCtrl(userSocket);
        }
    })

}

export function HeroUpgradeLvFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.Hero_UpgradeLvFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function HeroCostUpgradeLv(lv : number, lvRise : number, start : number, raise : number){
    var result = 0;
    for(let i = lv; i < lv + lvRise; i++){
        result += start + raise*i*(i+1);
    }
    return result;
}