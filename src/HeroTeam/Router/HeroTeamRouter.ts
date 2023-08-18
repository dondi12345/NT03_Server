import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { heroTeamCtrl } from "../Controller/HeroTeamCtrl";

class HeroTeamRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.HeroTeam_Login){
            heroTeamCtrl.Login(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroTeam_SelectHero){
            heroTeamCtrl.SelectHero(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroTeam_DeselectHero){
            heroTeamCtrl.DeselectHero(message, transferData);
            return;
        }
    }
}

export const heroTeamRouter = new HeroTeamRouter();