import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import {Test, CheckVersion} from "../Controller/DataCenterController";

export function DataCenterRouter(data, res){
    var message = Message.Parse(data);
    if(message.MessageCode == MessageCode.DataCenter_Test){
        Test(message, res);
        return;
    }
    if(message.MessageCode == MessageCode.DataCenter_CheckVersion){
        CheckVersion(message, res);
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