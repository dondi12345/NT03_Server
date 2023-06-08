
import { Hero, UpdateHero } from "../../HeroServer/Model/Hero";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { MinusRes } from "../../Res/Controller/ResController";
import { ResCode } from "../../Res/Model/ResCode";
import { DataResService } from "../../Res/Service/ResService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CraftHeroEquip, CreateHeroEquip, FindHeroEquipByIdUserPlayer, HeroEquip, HeroEquips, HeroWearEquip, IHeroEquip, UpdateHeroEquip } from "../Model/HeroEquip";
import { HeroEquipType } from "../Model/HeroEquipType";
import { IndexHeroEquipCraft, RateCraft, RateCraftWhite } from "../Model/VariableHeroEquip";

export async function HeroEquipLogin(message : IMessage, userSocket: IUserSocket){
    userSocket.HeroEquipDictionary = {};
    await FindHeroEquipByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        console.log("1685514345 "+respone)
        var heroEquips : HeroEquips = new HeroEquips;
        for (const item of respone) {
            var heroEquip = HeroEquip.Parse(item);
            userSocket.HeroEquipDictionary[heroEquip._id.toString()] = heroEquip;
            heroEquips.Elements.push(heroEquip);
        }
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
    if(userSocket.ResDictionary[craftHeroEquip.ResCode].Number <= 0){
        CraftHeroEquipFail(userSocket);
        return;
    }
    MinusRes(craftHeroEquip.ResCode, 1, userSocket).then(respone=>{
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
    var index = IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]][Math.floor(Math.random()*IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]].length)];
    var heroEquip = new HeroEquip();
    heroEquip = HeroEquip.HeroEquip(index, userSocket.IdUserPlayer)
    CreateHeroEquip(heroEquip).then(respone=>{
        if(respone == null || respone == undefined){
            CraftHeroEquipFail(userSocket);
            return;
        }
        var newEquip = HeroEquip.Parse(respone);
        userSocket.HeroEquipDictionary[newEquip._id.toHexString()] = newEquip;
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

export function WearingEquip(message : Message, userSocket : IUserSocket){
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero : Hero = userSocket.HeroDictionary[heroWearEquip.IdHero.toString()];
    if(hero == null || hero == undefined){
        WearingEquipFail(userSocket);
        return;
    }
    var equip : HeroEquip = userSocket.HeroEquipDictionary[heroWearEquip.IdHeroEquip.toString()];
    if(equip == null || equip == undefined){
        WearingEquipFail(userSocket);
        return;
    }
    if(equip.IdHero != null && equip.IdHero != undefined){
        var heroWearEquipUnwear = new HeroWearEquip();
        heroWearEquipUnwear.IdHero = equip.IdHero;
        heroWearEquipUnwear.IdHeroEquip = equip._id;
        var messageUnwear  = new Message();
        messageUnwear.MessageCode = MessageCode.HeroEquip_Unwearing;
        messageUnwear.Data = JSON.stringify(heroWearEquipUnwear);
        UnwearingEquip(messageUnwear, userSocket);
    }
    if(equip.HeroEquipType == HeroEquipType.Weapon && hero.Gear.IdWeapon != null && hero.Gear.IdWeapon != undefined){
        var heroWearEquipUnwear = new HeroWearEquip();
        heroWearEquipUnwear.IdHero = hero._id;
        heroWearEquipUnwear.IdHeroEquip = hero.Gear.IdWeapon;
        var messageUnwear  = new Message();
        messageUnwear.MessageCode = MessageCode.HeroEquip_Unwearing;
        messageUnwear.Data = JSON.stringify(heroWearEquipUnwear);
        UnwearingEquip(messageUnwear, userSocket);
        hero.Gear.IdWeapon = equip._id;
        equip.IdHero = hero._id;
    }
    if(equip.HeroEquipType == HeroEquipType.Armor && hero.Gear.IdArmor != null && hero.Gear.IdArmor != undefined){
        var heroWearEquipUnwear = new HeroWearEquip();
        heroWearEquipUnwear.IdHero = hero._id;
        heroWearEquipUnwear.IdHeroEquip = hero.Gear.IdArmor;
        var messageUnwear  = new Message();
        messageUnwear.MessageCode = MessageCode.HeroEquip_Unwearing;
        messageUnwear.Data = JSON.stringify(heroWearEquipUnwear);
        UnwearingEquip(messageUnwear, userSocket);
        hero.Gear.IdArmor = equip._id;
        equip.IdHero = hero._id;
    }
    if(equip.HeroEquipType == HeroEquipType.Helmet && hero.Gear.IdHelmet != null && hero.Gear.IdHelmet != undefined){
        var heroWearEquipUnwear = new HeroWearEquip();
        heroWearEquipUnwear.IdHero = hero._id;
        heroWearEquipUnwear.IdHeroEquip = hero.Gear.IdHelmet;
        var messageUnwear  = new Message();
        messageUnwear.MessageCode = MessageCode.HeroEquip_Unwearing;
        messageUnwear.Data = JSON.stringify(heroWearEquipUnwear);
        UnwearingEquip(messageUnwear, userSocket);
        hero.Gear.IdHelmet = equip._id;
        equip.IdHero = hero._id;
    }
    UpdateHero(hero);
    UpdateHeroEquip(equip);
    WearingEquipSuccess(message, userSocket);
}
 


export function WearingEquipFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}
export function WearingEquipSuccess(message : Message,userSocket : IUserSocket){
    message.MessageCode = MessageCode.HeroEquip_WearingSuccess;
    SendMessageToSocket(message, userSocket.Socket);
}

export function UnwearingEquip(message : Message, userSocket : IUserSocket){
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero : Hero = userSocket.HeroDictionary[heroWearEquip.IdHero.toString()];
    if(hero == null || hero == undefined){
        UnwearingEquipFail(userSocket);
        return;
    }
    var equip : HeroEquip = userSocket.HeroEquipDictionary[heroWearEquip.IdHeroEquip.toString()];
    if(equip == null || equip == undefined){
        UnwearingEquipFail(userSocket);
        return;
    }

    if(hero.Gear.IdWeapon == equip._id) hero.Gear.IdWeapon = undefined;
    if(hero.Gear.IdArmor == equip._id) hero.Gear.IdArmor = undefined;
    if(hero.Gear.IdHelmet == equip._id) hero.Gear.IdHelmet = undefined;
    equip.IdHero = undefined;
    UpdateHero(hero);
    UpdateHeroEquip(equip);
    UnwearingEquipSuccess(message, userSocket);    
}

export function UnwearingEquipFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}
export function UnwearingEquipSuccess(message : Message, userSocket : IUserSocket){
    message.MessageCode = MessageCode.HeroEquip_UnwearingSuccess;
    SendMessageToSocket(message, userSocket.Socket);
}