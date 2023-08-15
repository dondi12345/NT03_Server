import { accountController } from "../../AccountServer/Controller/AccountController";
import { dataCenterController } from "../../DataCenter/Controller/DataCenterController";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { messageRouter } from "../../MessageServer/Router/MessageRouter";
import { TransferData } from "../../TransferData";

class APIServerRouter{
    Router(message: Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.AccountServer_Register){
            accountController.AccountRegister(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.AccountServer_Login){
            accountController.AccountLogin(message, transferData)
            return;
        }
        if(message.MessageCode == MessageCode.DataCenter_CheckVersion){
            dataCenterController.CheckVersion(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.DataCenter_UpdateVersion){
            dataCenterController.ReloadData(message, transferData);
            return
        }
        messageRouter.Router(message, transferData);
    }
}

export const apiServerRouter = new APIServerRouter();