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

class MessageRouter{
    Router(message : Message, transferData : TransferData){
        userPlayerRouter.Router(message, transferData);
        currencyRouter.Router(message, transferData);
        heroRouter.Router(message, transferData);
        tdWaveRouter.Router(message, transferData);
    }
}

export const messageRouter = new MessageRouter();