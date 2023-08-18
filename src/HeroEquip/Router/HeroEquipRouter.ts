import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { heroEquipController } from "../Controller/HeroEquipController";

class HeroEquipRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.HeroEquip_Login){
            heroEquipController.Login(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroEquip_Craft){
            heroEquipController.CraftEquip(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroEquip_UpgradeLv){
            heroEquipController.UpgradeLv(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroEquip_Wearing){
            heroEquipController.WearingEquip(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.HeroEquip_Unwearing){
            heroEquipController.UnWearingEquip(message, transferData);
            return;
        }
    }
}

export const heroEquipRouter = new HeroEquipRouter();