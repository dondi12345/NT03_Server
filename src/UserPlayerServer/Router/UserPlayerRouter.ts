import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { userPlayerController } from "../Controller/UserPlayerController";


class UserPlayerRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.UserPlayerServer_Login){
            userPlayerController.UserPlayerLogin(message, transferData);
            return true;
        }
        if(message.MessageCode == MessageCode.UserPlayerServer_Logout){
            userPlayerController.UserPlayerLogout(message);
            return true;
        }
        return false;
    }
}

export const userPlayerRouter = new UserPlayerRouter();