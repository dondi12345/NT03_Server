
import { Types } from "mongoose";
import { UpdateHeroToClient, UpdateHeroes } from "../../HeroServer/Controller/HeroController";
import { FindHeroById, Gear, Hero, HeroModel, Heroes, IHero, UpdateHero } from "../../HeroServer/Model/Hero";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { ChangeRes } from "../../Res/Controller/ResController";
import { ResCode } from "../../Res/Model/ResCode";
import { DataResService } from "../../Res/Service/ResService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { CraftHeroEquip, CreateHeroEquip, FindHeroEquipById, FindHeroEquipByIdUserPlayer, HeroEquip, HeroEquipModel, HeroEquipUpgradeLv, HeroEquips, HeroWearEquip, IHeroEquip, UpdateHeroEquip } from "../Model/HeroEquip";
import { HeroEquipType } from "../Model/HeroEquipType";
import { IndexHeroEquipCraft, RateCraft } from "../Model/HeroEquipConfig";
import { heroEquipDataDictionary } from "../Service/HeroEquipService";
import { LogUserSocket } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { HeroEquipCode } from "../Model/HeroEquipCode";

export async function HeroEquipLogin(message : Message, userSocket: IUserSocket){
    await FindHeroEquipByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        var heroEquips : HeroEquips = new HeroEquips;
        userSocket.HeroEquip = {};
        for (const item of respone) {
            var heroEquip = HeroEquip.Parse(item);
            heroEquips.Elements.push(heroEquip);
            userSocket.HeroEquip[heroEquip._id.toString()] = heroEquip;
        }
        console.log("Dev 1685514345 "+respone.length)
        LogUserSocket(LogCode.HeroEquip_LoginSuccess, userSocket, "", LogType.Normal)
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginSuccess;
        message.Data = JSON.stringify(heroEquips);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        LogUserSocket(LogCode.HeroEquip_LoginFail, userSocket, e, LogType.Error)
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginFail;
        message.Data = "HeroEquip login fail";
        console.log("Dev 1685514350 "+ e);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

// 10f;80f;800f;10000f;100000f;1000000f;1000000f;
export async function CraftEquip(message : Message, userSocket: IUserSocket) {
    var craftHeroEquip = CraftHeroEquip.Parse(message.Data);
    ChangeRes(craftHeroEquip.ResCode, -1, userSocket).then(respone=>{
        console.log("Dev 1686209545 "+ respone);
        if(respone){
            RandomHeroEquip(craftHeroEquip, userSocket);
        }else{
            LogUserSocket(LogCode.HeroEquip_ChangeResFail, userSocket, "", LogType.Normal)
            CraftHeroEquipFail(userSocket);
        }
    }).catch(err=>{
        LogUserSocket(LogCode.HeroEquip_ChangeResError, userSocket, err, LogType.Error)
    })
}

export function RandomHeroEquip(craftHeroEquip : CraftHeroEquip, userSocket: IUserSocket){
    var maxRate = RateCraft[ResCode[craftHeroEquip.ResCode]];
    var totalRate = 0;
    totalRate += DataResService[craftHeroEquip.ResCode].CraftHeroEquip;
    var rand = Math.random()*maxRate;
    console.log(rand +" - "+ totalRate+" - "+maxRate);
    if(rand > totalRate){
        LogUserSocket(LogCode.HeroEquip_ChangeResFail, userSocket, "", LogType.Normal)
        CraftHeroEquipFail(userSocket);
        return;
    }
    IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]]
    var code = IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]][Math.floor(Math.random()*IndexHeroEquipCraft[ResCode[craftHeroEquip.ResCode]].length)];
    var heroEquip = new HeroEquip();
    heroEquip = HeroEquip.HeroEquip(code, userSocket.IdUserPlayer)
    CreateHeroEquip(heroEquip).then(respone=>{
        if(respone == null || respone == undefined){
            LogUserSocket(LogCode.HeroEquip_CraftEquipFail, userSocket, "", LogType.Normal)
            CraftHeroEquipFail(userSocket);
            return;
        }
        var newEquip = HeroEquip.Parse(respone);
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_CraftSuccess;
        message.Data = JSON.stringify(newEquip);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        LogUserSocket(LogCode.HeroEquip_CreateNewFail, userSocket, e, LogType.Error)
        console.log("Dev 1686210916 "+e);
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

export async function WearingEquip(message : Message, userSocket : IUserSocket) {
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero = userSocket.Hero[heroWearEquip.IdHero.toString()]
    if(hero == null || hero == undefined || hero.Code == HeroCode.Unknown){
        WearingEquipFail(userSocket);
        return;
    }
    var heroEquip = userSocket.HeroEquip[heroWearEquip.IdHeroEquip.toString()]
    if(heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown){
        WearingEquipFail(userSocket);
        return;
    }
    var heroEquipData = heroEquipDataDictionary[heroEquip.Code];
    var heroEquip_Old;
    console.log("Dev 1691055136 Type: "+heroEquipData.HeroEquipType)
    if(heroEquipData.HeroEquipType === HeroEquipType.Weapon){
        if(hero.IdWeapon != undefined && hero.IdWeapon != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdWeapon.toString()];
        hero.IdWeapon = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055136 IdWeapon")
    }
    if(heroEquipData.HeroEquipType === HeroEquipType.Armor){
        if(hero.IdArmor != undefined && hero.IdArmor != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdArmor.toString()];
        hero.IdArmor = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055137 IdArmor")
    }
    if(heroEquipData.HeroEquipType === HeroEquipType.Helmet){
        if(hero.IdHelmet != undefined && hero.IdHelmet != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdHelmet.toString()];
        hero.IdHelmet = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055138 IdHelmet")
    }

    if(heroEquip_Old != null && heroEquip_Old != undefined){
        delete heroEquip["IdHero"];
        RemoveHeroFromHeroEquip(heroEquip_Old, userSocket);
    }
    console.log("Dev 1691055132 hero:", hero)
    console.log("Dev 1691055133 heroEquip:", heroEquip)
    console.log("Dev 1691055134 heroEquipData:", heroEquipData)
    console.log("Dev 1691055135 heroEquip_Old:", heroEquip_Old)
    AddHeroToHeroEquip(heroEquip, userSocket);
    AddHeroEquipToHero(hero, userSocket);
}

export async function UnwearingEquip(message : Message, userSocket : IUserSocket) {
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero = userSocket.Hero[heroWearEquip.IdHero.toString()]
    if(hero == null || hero == undefined || hero.Code == HeroCode.Unknown){
        UnwearingEquipFail(userSocket);
    }else{
        if(hero.IdWeapon != undefined && hero.IdWeapon != null && hero.IdWeapon == heroWearEquip.IdHeroEquip){
            delete hero.IdWeapon;
        }
        if(hero.IdArmor != undefined && hero.IdArmor != null && hero.IdArmor == heroWearEquip.IdHeroEquip){
            delete hero.IdArmor;
        }
        if(hero.IdHelmet != undefined && hero.IdHelmet != null && hero.IdHelmet == heroWearEquip.IdHeroEquip){
            delete hero.IdHelmet;
        }
        RemoveHeroEquipFromHero(hero, userSocket);
    }
    var heroEquip = userSocket.HeroEquip[heroWearEquip.IdHeroEquip.toString()]
    if(heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown){
        UnwearingEquipFail(userSocket);
    }else{
        delete heroEquip.IdHero;
        RemoveHeroFromHeroEquip(heroEquip, userSocket);
    }
}

export async function RemoveHeroFromHeroEquip(heroEquip : HeroEquip, userSocket : UserSocket) {
    HeroEquipModel.updateOne(
        {
            _id : heroEquip._id,
        },
        {
            $unset :{IdHero: 1}
        }
    ).then(()=>{
        UpdateHeroEquipToClient(heroEquip, userSocket);
    }).catch((err)=>{
        LogUserSocket(LogCode.HeroEquip_UnequipFail, userSocket, err, LogType.Error);
    })
}

export async function RemoveHeroEquipFromHero(hero : Hero, userSocket : UserSocket){
    HeroModel.updateOne(
        {
            _id : hero._id
        },
        {
            $set : {Gear : hero},
        }
    ).then(()=>{
        UpdateHeroToClient(hero, userSocket);
    }).catch((err)=>{
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export async function AddHeroToHeroEquip(heroEquip : HeroEquip, userSocket : UserSocket){
    HeroEquipModel.updateOne(
        {
            _id : heroEquip._id
        },
        {
            $set:{IdHero : heroEquip.IdHero}
        }
    ).then(()=>{
        UpdateHeroEquipToClient(heroEquip, userSocket);
    }).catch((err)=>{
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export async function AddHeroEquipToHero(hero : Hero, userSocket : UserSocket){
    HeroModel.updateOne(
        {
            _id : hero._id
        },
        {
            $set : {Gear : hero}
        }
    ).then(()=>{
        UpdateHeroToClient(hero, userSocket);
    }).catch((err)=>{
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export function UpdateHeroEquipToClient(heroEquip : HeroEquip, userSocket : UserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpdateEquip;
    message.Data = JSON.stringify(heroEquip);
    SendMessageToSocket(message, userSocket.Socket);
}


export function WearingEquipFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_WearingFail;
    SendMessageToSocket(message, userSocket.Socket);
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

export function HeroEquipUpgradeLvCtrl(message : Message, userSocket : IUserSocket){
    var heroEquipUpgradeLv = HeroEquipUpgradeLv.Parse(message.Data);
    FindHeroEquipById(heroEquipUpgradeLv.IdEquip).then((res : HeroEquip)=>{
        var heroEquipData = heroEquipDataDictionary[res.Code];
        var cost = HeroEquipCostUpgradeLv(res.Lv, heroEquipUpgradeLv.NumberLv, heroEquipData.CostUpgrade, heroEquipData.CostUpgradeRise);
        if(cost > userSocket.Currency.Money){
            HeroEquipUpgradeLvFail(userSocket);
        }else{
            userSocket.Currency.Money -= cost;
            res.Lv += heroEquipUpgradeLv.NumberLv;
            var heroeEquips = new HeroEquips();
            heroeEquips.Elements.push(res);
            UpdateHeroEquips(heroeEquips, userSocket);
            // UpdateCurrencyCtrl(userSocket);
        }
    })

}

export function HeroEquipUpgradeLvFail(userSocket : IUserSocket){
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpgradeLvFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function HeroEquipCostUpgradeLv(lv : number, lvRise : number, start : number, raise : number){
    var result = 0;
    for(let i = lv; i < lv + lvRise; i++){
        result += start + raise*i*(i+1);
    }
    return result;
}