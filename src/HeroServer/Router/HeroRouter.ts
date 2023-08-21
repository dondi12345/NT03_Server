import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { heroController } from "../Controller/HeroController";

class HeroRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.Hero_Login){
            heroController.Login(message, transferData);
            return true;
        }
        if(message.MessageCode == MessageCode.Hero_Summon){
            heroController.Summon(message, transferData);
            return true;
        }
        if(message.MessageCode == MessageCode.Hero_GetSummonResult){
            heroController.GetSummonResult(message, transferData);
            return true;
        }
        if(message.MessageCode == MessageCode.Hero_HireHero){
            heroController.HireHero(message, transferData);
            return true;
        }
        if(message.MessageCode == MessageCode.Hero_UpgradeLv){
            heroController.UpgradeLv(message, transferData);
            return true;
        }
        return false;
    }
}

export const heroRouter = new HeroRouter();