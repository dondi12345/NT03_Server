import redis from 'redis';
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { Hero, IHero } from "../Model/Hero";
import { HeroCode } from "../Model/HeroCode";
import { ISummonHero, SummonHero, SummonHeroSlot } from "../Model/SummonHero";
import { RateSummon } from "../Model/VariableHero";
import { Redis } from '../../Enviroment/Env';
import { MessageCode } from '../../MessageServer/Model/MessageCode';
import { SendMessageToSocket } from '../../MessageServer/Service/MessageService';

const redisHero = redis.createClient();

export function CreateNewHero(){
    for (let index = 0; index < 10; index++) {
        var hero = Hero.NewHero();
        console.log(JSON.stringify(hero));
        
    }
}

export function Summon(message : IMessage, userSocket: IUserSocket){
    var rateSummon = RateSummon[0]
    var totalRate = 0;
    for (let property in rateSummon) {
        totalRate += rateSummon[property];
    }
    var summonHero = new SummonHero();
    summonHero.IdUserPlayer = userSocket.IdUserPlayer;
    for (let index = 0; index < 10; index++) {
        var rate = Math.floor(Math.random()*totalRate);
        
        for (let property in rateSummon) {
            if(rate < rateSummon[property]){
                var summonHeroSlot = new SummonHeroSlot();
                summonHeroSlot.HeroCode = HeroCode[property];
                summonHeroSlot.Hired = false;
                summonHero.Slots.push(summonHeroSlot);
                break;
            }
            rate -= rateSummon[property];
        }
    }
    redisHero.set(Redis.KeyHeroSummon+userSocket.IdUserPlayer, JSON.stringify(summonHero));
    var message = new Message();
    message.MessageCode = MessageCode.Hero_ResultSummon;
    message.Data = JSON.stringify(summonHero);
    SendMessageToSocket(message, userSocket.Socket);
}

export function GetSummonResult(message : IMessage, userSocket: IUserSocket){
    var heroSummon = redisHero.get(Redis.KeyHeroSummon + userSocket.IdUserPlayer,  (error, result)=>{
        var data;
        if(error || result == null || result == undefined){
            data == null;
        }else{
            data = result;
        }
        var message = new Message();
        message.MessageCode = MessageCode.Hero_SendSummonResult;
        message.Data = data;
        SendMessageToSocket(message, userSocket.Socket);
    })
}