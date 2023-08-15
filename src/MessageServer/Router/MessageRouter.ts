import { Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import {currencyController } from "../../Currency/Controller/CurrencyController";
import {userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { TransferData } from "../../TransferData";
import { tdWaveController } from "../../TDWave/Controller/TDWaveController";
import { accountController } from "../../AccountServer/Controller/AccountController";
import { heroController } from "../../HeroServer/Controller/HeroController";
import { heroEquipController } from "../../HeroEquip/Controller/HeroEquipController";

class MessageRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.UserPlayerServer_Login){
            userPlayerController.UserPlayerLogin(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.UserPlayerServer_Logout){
            userPlayerController.UserPlayerLogout(message);
            return;
        }
        if(message.MessageCode == MessageCode.Currency_Login){
            currencyController.CurrencyLogin(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.Hero_Login){
            heroController.Login(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.Hero_Summon){
            heroController.Summon(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.Hero_GetSummonResult){
            heroController.GetSummonResult(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.Hero_HireHero){
            heroController.HireHero(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.Hero_UpgradeLv){
            heroController.UpgradeLv(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroEquip_Login){
            heroEquipController.Login(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.TDWave_ProtectedSuccess){
            tdWaveController.ProtectedSuccessCtrl(message, transferData)
            return;
        }
        if(message.MessageCode == MessageCode.TDWave_ProtectedFail){
            tdWaveController.ProtectedFailCtrl(message, transferData);
            return;
        }
    }
}

export const messageRouter = new MessageRouter();