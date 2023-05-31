import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { UpdateResCtrl } from "../../ResServer/Controller/ResController";
import { UpdateRes } from "../../ResServer/Model/Res";
import { ResCode } from "../../ResServer/Model/ResCode";
import { ResDetail } from "../../ResServer/Model/ResDetail";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHeroEquip, FindHeroEquipByIdUserPlayer, HeroEquip } from "../Model/HeroEquip";
import { RateCraftWhite } from "../Model/VariableHeroEquip";

export async function HeroEquipLogin(message : IMessage, userSocket: IUserSocket){
    userSocket.HeroEquipDictionary = {};
    await FindHeroEquipByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        console.log("1685514345 "+respone)
        for (const item of respone) {
            userSocket.HeroEquipDictionary[item.id] = item;
        }
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginSuccess;
        message.Data = JSON.stringify(userSocket.HeroEquipDictionary);
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

export async function CraftWhiteHeroEquip(message : IMessage, userSocket: IUserSocket){
    if(userSocket.Res.BlueprintHeroEquip_WhiteItem <=0){
        CraftHeroEquipFail(userSocket);
        return;
    }
    
    userSocket.Res.BlueprintHeroEquip_WhiteItem --;
    var messageUpdateRes = new Message();
    messageUpdateRes.MessageCode = MessageCode.Res_UpdateRes;
    var resDetail = new ResDetail();
    resDetail.Name = ResCode[ResCode.BlueprintHeroEquip_WhiteItem];
    resDetail.Number = userSocket.Res.BlueprintHeroEquip_WhiteItem;
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
    var data = await CreateHeroEquip(heroEquip);
    if(data == null || data == undefined){
        CraftHeroEquipFail(userSocket);
        return;
    }
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
