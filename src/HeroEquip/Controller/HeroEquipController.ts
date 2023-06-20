
import { UpdateHeroes } from "../../HeroServer/Controller/HeroController";
import { FindHeroById, Gear, Hero, Heroes, IHero, UpdateHero } from "../../HeroServer/Model/Hero";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { ChangeRes } from "../../Res/Controller/ResController";
import { ResCode } from "../../Res/Model/ResCode";
import { DataResService } from "../../Res/Service/ResService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CraftHeroEquip, CreateHeroEquip, FindHeroEquipById, FindHeroEquipByIdUserPlayer, HeroEquip, HeroEquips, HeroWearEquip, IHeroEquip, UpdateHeroEquip } from "../Model/HeroEquip";
import { HeroEquipType } from "../Model/HeroEquipType";
import { IndexHeroEquipCraft, RateCraft, RateCraftWhite } from "../Model/VariableHeroEquip";

export async function HeroEquipLogin(message : IMessage, userSocket: IUserSocket){
    await FindHeroEquipByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        var heroEquips : HeroEquips = new HeroEquips;
        for (const item of respone) {
            var heroEquip = HeroEquip.Parse(item);
            heroEquips.Elements.push(heroEquip);
        }
        console.log("1685514345 "+respone.length)
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginSuccess;
        message.Data = JSON.stringify(heroEquips);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginFail;
        message.Data = "HeroEquip login fail";
        console.log("1685514350 "+ e);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

// 10f;80f;800f;10000f;100000f;1000000f;1000000f;
export async function CraftEquip(message : IMessage, userSocket: IUserSocket) {
    var craftHeroEquip = CraftHeroEquip.Parse(message.Data);
    ChangeRes(craftHeroEquip.ResCode, -1, userSocket).then(respone=>{
        console.log("1686209545 "+ respone);
        if(respone){
            RandomHeroEquip(craftHeroEquip, userSocket);
        }else{
            CraftHeroEquipFail(userSocket);
        }
    })
}

export function RandomHeroEquip(craftHeroEquip : CraftHeroEquip, userSocket: IUserSocket){
    var maxRate = RateCraft[ResCode[craftHeroEquip.ResCode]];
    var totalRate = 0;
    totalRate += DataResService[craftHeroEquip.ResCode].CraftHeroEquip;
    var rand = Math.random()*maxRate;
    console.log(rand +" - "+ totalRate+" - "+maxRate);
    if(rand > totalRate){
        CraftHeroEquipFail(userSocket);
        return;
    }
    IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]]
    var code = IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]][Math.floor(Math.random()*IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]].length)];
    var heroEquip = new HeroEquip();
    heroEquip = HeroEquip.HeroEquip(code, userSocket.IdUserPlayer)
    CreateHeroEquip(heroEquip).then(respone=>{
        if(respone == null || respone == undefined){
            CraftHeroEquipFail(userSocket);
            return;
        }
        var newEquip = HeroEquip.Parse(respone);
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_CraftSuccess;
        message.Data = JSON.stringify(newEquip);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        console.log("1686210916 "+e);
        CraftHeroEquipFail(userSocket);
        return;
    })
}

function CraftHeroEquipFail(userSocket: IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_CraftFail;
    message.Data = "Craft Fail";
    SendMessageToSocket(message, userSocket.Socket);
}

export async function WearingEquip(message : Message, userSocket : IUserSocket){
    var heroeEquipsUpdate = new HeroEquips();
    var heroesUpdate = new Heroes();
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero  = new Hero();
    await FindHeroById(heroWearEquip.IdHero).then(res =>{
        hero = res;
    });
    if(hero == null || hero == undefined || hero.Code == HeroCode.Unknown){
        WearingEquipFail(userSocket);
        return;
    }
    var heroEquip;
    await FindHeroEquipById(heroWearEquip.IdHeroEquip).then(res =>{
        heroEquip = res;
    })
    if(heroEquip == null || heroEquip == undefined){
        WearingEquipFail(userSocket);
        return;
    }
    switch (heroEquip.Type) {
        case HeroEquipType.Weapon:
            if(hero.Gear.IdWeapon != null && hero.Gear.IdWeapon != undefined){
                await FindHeroEquipById(hero.Gear.IdWeapon).then((res : HeroEquip)=>{
                    if(res == null || res == undefined) return;
                    res.IdHero = undefined;
                    heroeEquipsUpdate.Elements.push(res);
                })

            }
            hero.Gear.IdWeapon = heroEquip._id;
            break;
        case HeroEquipType.Armor:
            if(hero.Gear.IdArmor != null && hero.Gear.IdArmor != undefined){
                await FindHeroEquipById(hero.Gear.IdArmor).then((res : HeroEquip)=>{
                    if(res == null || res == undefined) return;
                    res.IdHero = undefined;
                    heroeEquipsUpdate.Elements.push(res);
                })

            }
            hero.Gear.IdArmor = heroEquip._id;
            break;
        case HeroEquipType.Helmet:
            if(hero.Gear.IdHelmet != null && hero.Gear.IdHelmet != undefined){
                await FindHeroEquipById(hero.Gear.IdHelmet).then((res : HeroEquip)=>{
                    if(res == null || res == undefined) return;
                    res.IdHero = undefined;
                    heroeEquipsUpdate.Elements.push(res);
                })

            }
            hero.Gear.IdHelmet = heroEquip._id;
            break;
    }
    heroEquip.IdHero = hero._id;

    heroeEquipsUpdate.Elements.push(heroEquip);
    heroesUpdate.Elements.push(hero);

    UpdateHeroes(heroesUpdate, userSocket);
    UpdateHeroEquips(heroeEquipsUpdate, userSocket);
}
 


export function WearingEquipFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export async function UnwearingEquip(message : Message, userSocket : IUserSocket){
    var heroeEquipsUpdate = new HeroEquips();
    var heroesUpdate = new Heroes();
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero; 
    await FindHeroById(heroWearEquip.IdHero).then(res=>{
        hero = res;
    })
    if(hero == null || hero == undefined){
        UnwearingEquipFail(userSocket);
        return;
    }
    var heroEquip;
    await FindHeroEquipById(heroWearEquip.IdHeroEquip).then(res=>{
        heroEquip = res;
    })
    if(heroEquip == null || heroEquip == undefined){
        UnwearingEquipFail(userSocket);
        return;
    }

    if(heroEquip.Type == HeroEquipType.Weapon) hero.Gear.IdWeapon = undefined;
    if(heroEquip.Type == HeroEquipType.Armor) hero.Gear.IdArmor = undefined;
    if(heroEquip.Type == HeroEquipType.Helmet) hero.Gear.IdHelmet = undefined;
    heroEquip.IdHero = undefined;

    heroesUpdate.Elements.push(hero);
    heroeEquipsUpdate.Elements.push(heroEquip);

    UpdateHeroes(heroesUpdate, userSocket);
    UpdateHeroEquips(heroeEquipsUpdate, userSocket);
}

export function UnwearingEquipFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function UpdateHeroEquips(heroEquips : HeroEquips, userSocket : IUserSocket){
    heroEquips.Elements.forEach(element =>{
        UpdateHeroEquip(element);
    })

    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpdateEquips;
    message.Data = JSON.stringify(heroEquips);
    SendMessageToSocket(message, userSocket.Socket)
}