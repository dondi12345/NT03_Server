import { Hero, UpdateHero } from "../../HeroServer/Model/Hero";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { UpdateResByResCode, UpdateResCtrl } from "../../ResServer/Controller/ResController";
import { DataRes } from "../../ResServer/DataRes";
import { UpdateRes } from "../../ResServer/Model/Res";
import { ResCode } from "../../ResServer/Model/ResCode";
import { ResDetail } from "../../ResServer/Model/ResDetail";
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
    if(userSocket.Res[ResCode[craftHeroEquip.ResCode]] <= 0){
        CraftHeroEquipFail(userSocket);
        return;
    }
    userSocket.Res[ResCode[craftHeroEquip.ResCode]] --;
    UpdateResByResCode([craftHeroEquip.ResCode], userSocket);
    var maxRate = RateCraft[ResCode[craftHeroEquip.ResCode]];
    var totalRate = 0;
    DataRes.forEach(element => {
        if(element.ResCode == ResCode[craftHeroEquip.ResCode]){
            totalRate += element.CraftHeroEquip;
        }
    });
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
    var data : IHeroEquip = await CreateHeroEquip(heroEquip);
    if(data == null || data == undefined){
        CraftHeroEquipFail(userSocket);
        return;
    }
    userSocket.HeroEquipDictionary[data._id.toHexString()] = data;
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_CraftSuccess;
    message.Data = JSON.stringify(heroEquip);
    SendMessageToSocket(message, userSocket.Socket);
}

export async function CraftWhiteHeroEquip(message : IMessage, userSocket: IUserSocket){
    if(userSocket.Res.BlueprintHeroEquip_White <=0){
        CraftHeroEquipFail(userSocket);
        return;
    }

    userSocket.Res.BlueprintHeroEquip_White --;
    var messageUpdateRes = new Message();
    messageUpdateRes.MessageCode = MessageCode.Res_UpdateRes;
    var resDetail = new ResDetail();
    resDetail.Name = ResCode[ResCode.BlueprintHeroEquip_White];
    resDetail.Number = userSocket.Res.BlueprintHeroEquip_White;
    var listResDetal : ResDetail[] = [];
    listResDetal.push(resDetail);
    messageUpdateRes.Data = JSON.stringify(listResDetal)
    UpdateResCtrl(messageUpdateRes, userSocket);

    var rand = Math.random()*10;
    if(rand > 5){
        CraftHeroEquipFail(userSocket);
        return;
    }
    var index = RateCraftWhite[Math.floor(Math.random()*RateCraftWhite.length)];
    var heroEquip = new HeroEquip();
    heroEquip.Index = index;
    heroEquip.HeroEquipType = HeroEquip.ParseToHeroEquipType(index);
    heroEquip.IdUserPlayer = userSocket.IdUserPlayer;
    var data : IHeroEquip = await CreateHeroEquip(heroEquip);
    if(data == null || data == undefined){
        CraftHeroEquipFail(userSocket);
        return;
    }
    userSocket.HeroEquipDictionary[data._id.toHexString()] = data;
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_CraftSuccess;
    message.Data = JSON.stringify(heroEquip);
    SendMessageToSocket(message, userSocket.Socket);
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