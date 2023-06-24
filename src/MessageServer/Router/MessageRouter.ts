import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";
import { UpdateCurrencyCtrl, CurrencyLogin } from "../../Currency/Controller/CurrencyController";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { AccountLogin, AccountRegister } from "../../AccountServer/Controller/AccountController";
import { UserPlayerLogin } from "../../UserPlayerServer/Controller/UserPlayerController";
import { GetSummonResult, HeroLogin, HeroUpgradeLvCtrl, HireHero, Summon } from "../../HeroServer/Controller/HeroController";
import { CraftEquip, HeroEquipLogin, HeroEquipUpgradeLvCtrl, UnwearingEquip, WearingEquip } from "../../HeroEquip/Controller/HeroEquipController";
import { ResLogin } from "../../Res/Controller/ResController";
import { HeroTeamLogin, SelectHeroTeamCtrl } from "../../HeroTeam/Controller/HeroTeamCtrl";


export function MessageRouter(message : IMessage, userSocket : IUserSocket){
    if(message.MessageCode == MessageCode.MessageServer_Test){
        console.log("Dev 1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageServer_Connect){
        Connect(message, userSocket);
        return;
    }
    if(userSocket.IdAccount == null || userSocket.IdAccount == undefined){
        console.log("Dev 1684769809 Logout Acount")
        return;
    }
    if(message.MessageCode == MessageCode.UserPlayerServer_Login){
        UserPlayerLogin(message, userSocket);
        return;
    }
    if(userSocket.IdUserPlayer == null || userSocket.IdUserPlayer == undefined){
        console.log("Dev 1685002171 Logout Acount")
        return;
    }
    if(message.MessageCode == MessageCode.Currency_Login){
        CurrencyLogin(message, userSocket)
    }
    if(message.MessageCode == MessageCode.Hero_Summon){
        Summon(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_GetSummonResult){
        GetSummonResult(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_HireHero){
        HireHero(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_Login){
        HeroLogin(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_UpgradeLv){
        HeroUpgradeLvCtrl(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroEquip_Login){
        HeroEquipLogin(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroEquip_Craft){
        CraftEquip(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroEquip_Wearing){
        WearingEquip(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroEquip_Unwearing){
        UnwearingEquip(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroEquip_UpgradeLv){
        HeroEquipUpgradeLvCtrl(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Res_Login){
        ResLogin(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroTeam_Login){
        HeroTeamLogin(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.HeroTeam_SelectHero){
        SelectHeroTeamCtrl(message, userSocket);
        return;
    }
}