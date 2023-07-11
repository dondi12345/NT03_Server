import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import DataCenterController from "../Controller/DataCenterController";

export function DataCenterRouter(data, res){
    var message = Message.Parse(data);
    if(message.MessageCode == MessageCode.DataCenter_Test){
        DataCenterController.Test(message, res);
        return;
    }
    if(message.MessageCode == MessageCode.DataCenter_CheckVersion){
        DataCenterController.CheckVersion(message, res);
        return;
    }
    // if(message.MessageCode == MessageCode.AccountServer_Login){
    //     AccountLogin(message, res)
    //     return;
    // }
    // if(message.MessageCode == MessageCode.AccountServer_LoginToken){
    //     AccountLoginTocken(message, res);
    //     return;
    // }
}