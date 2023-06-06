import redis from 'redis';
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHero, DataHeroes, FindHeroByIdUserPlayer, Hero, HeroModel, IHero } from "../Model/Hero";
import { HeroCode } from "../Model/HeroCode";
import { ISummonHero, ISummonHeroSlot, SummonHero, SummonHeroSlot } from "../Model/SummonHero";
import { RateSummon } from "../Model/VariableHero";
import { Redis } from '../../Enviroment/Env';
import { MessageCode } from '../../MessageServer/Model/MessageCode';
import { SendMessageToSocket } from '../../MessageServer/Service/MessageService';
import { ResLogin, UpdateResCtrl } from '../../ResServer/Controller/ResController';
import { ResDetail } from '../../ResServer/Model/ResDetail';
import { ResCode } from '../../ResServer/Model/ResCode';

const redisHero = redis.createClient();

export function CreateNewHero(){
    for (let index = 0; index < 10; index++) {
        var hero = new Hero();
        console.log(JSON.stringify(hero));
        
    }
}

export async function HeroLogin(message : IMessage, userSocket: IUserSocket){
    userSocket.HeroDictionary = {};
    await FindHeroByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        console.log("1685293708 "+respone)
        var dataHeroes = new DataHeroes();
        for (let item of respone) {
            var hero = Hero.Parse(item);
            console.log("1685979990 "+ JSON.stringify(hero));
            dataHeroes.Heroes.push(hero);
            userSocket.HeroDictionary[hero._id.toString()] = hero;
        }
        var message = new Message();
        message.MessageCode = MessageCode.Hero_LoginSuccess;
        message.Data = JSON.stringify(dataHeroes);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        var message = new Message();
        message.MessageCode = MessageCode.Hero_LoginFail;
        message.Data = "Hero login fail";
        console.log("1685293337 "+ e);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

export function Summon(message : IMessage, userSocket: IUserSocket){
    if(userSocket.Res == null || userSocket.Res == undefined){
        ResLogin(new Message(), userSocket);
        console.log("1685287568 Not connect to Res")
        return;
    }
    if(userSocket.Res.HeroScroll <= 0) {
        var message = new Message();
        message.MessageCode = MessageCode.Hero_SummonFail;
        message.Data = "Dont enough HeroScroll";
        SendMessageToSocket(message, userSocket.Socket);
        return;
    }else{
        userSocket.Res.HeroScroll --;
        var messageUpdateRes = new Message();
        messageUpdateRes.MessageCode = MessageCode.Res_UpdateRes;
        var resDetail = new ResDetail();
        resDetail.Name = ResCode[ResCode.HeroScroll];
        resDetail.Number = userSocket.Res.HeroScroll;
        var listResDetal : ResDetail[] = [];
        listResDetal.push(resDetail);
        messageUpdateRes.Data = JSON.stringify(listResDetal)
        UpdateResCtrl(messageUpdateRes, userSocket);
    }

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
        }else{
            try {
                var summonHero = SummonHero.Parse(result);
                var indexFindout = -1;
                for (let index = 0; index < summonHero.Slots.length; index++) {
                    const element = summonHero.Slots[index];
                    console.log("1685507029 "+ element._id.toString() + " - "+summonHeroSlot._id.toString());
                    if(element._id.toString() === summonHeroSlot._id.toString()){
                        element.Hired = true;
                        indexFindout = index;
                        break;
                    }
                }
                redisHero.set(Redis.KeyHeroSummon+userSocket.IdUserPlayer, JSON.stringify(summonHero));

                var hero = Hero.NewHero(summonHero.Slots[indexFindout].Hero);
                HireHeroSuccess(hero, userSocket);
            } catch (error) {
                console.log("1685284455 "+error)
                SendMessageToSocket(HireFailMessage(), userSocket.Socket); 
            }
        }
    })
}

export function HireHeroSuccess(hero : IHero, userSocket: IUserSocket){
    CreateHero(hero).then((res : IHero)=>{
        userSocket.HeroDictionary[res._id.toString()] = res;
        console.log("1685974556 Adding Hero")
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