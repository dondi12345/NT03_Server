import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import {accountController } from "../Controller/AccountController";

export function AccountServerRouter(data, transferData: TransferData){
    var message = Message.Parse(data);
    transferData.Token = message.Token;
    if(message.MessageCode == MessageCode.AccountServer_Register){
        accountController.AccountRegister(message, transferData);
        return;
    }
    if(message.MessageCode == MessageCode.AccountServer_Login){
        accountController.AccountLogin(message, transferData)
        return;
    }
}