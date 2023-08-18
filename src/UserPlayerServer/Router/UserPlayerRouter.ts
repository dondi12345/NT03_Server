import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { userPlayerController } from "../Controller/UserPlayerController";


class UserPlayerRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.UserPlayerServer_Login){
            userPlayerController.UserPlayerLogin(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.UserPlayerServer_Logout){
            userPlayerController.UserPlayerLogout(message);
            return;
        }
    }
}

export const userPlayerRouter = new UserPlayerRouter();