import { Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import {currencyController } from "../../Currency/Controller/CurrencyController";
import {userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { TransferData } from "../../TransferData";
import { tdWaveController } from "../../TDWave/Controller/TDWaveController";
import { accountController } from "../../AccountServer/Controller/AccountController";
import { heroController } from "../../HeroServer/Controller/HeroController";
import { heroEquipController } from "../../HeroEquip/Controller/HeroEquipController";
import { heroTeamCtrl } from "../../HeroTeam/Controller/HeroTeamCtrl";
import { currencyRouter } from "../../Currency/Router/CurrencyRouter";
import { userPlayerRouter } from "../../UserPlayerServer/Router/UserPlayerRouter";
import { heroRouter } from "../../HeroServer/Router/HeroRouter";
import { tdWaveRouter } from "../../TDWave/Router/TDWaveRouter";
import { heroEquipRouter } from "../../HeroEquip/Router/HeroEquipRouter";
import { heroTeamRouter } from "../../HeroTeam/Router/HeroTeamRouter";

class MessageRouter{
    Router(message : Message, transferData : TransferData){
        if(userPlayerRouter.Router(message, transferData)) return;
        if(currencyRouter.Router(message, transferData)) return;
        if(heroRouter.Router(message, transferData)) return;
        if(heroTeamRouter.Router(message, transferData)) return;
        if(heroEquipRouter.Router(message, transferData)) return;
        if(tdWaveRouter.Router(message, transferData)) return;
    }
}

export const messageRouter = new MessageRouter();