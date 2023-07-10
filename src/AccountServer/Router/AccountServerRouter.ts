import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountLogin, AccountLoginTocken, AccountRegister } from "../Controller/AccountController";

export function AccountServerRouter(data, res){
    var message = Message.Parse(data);
    if(message.MessageCode == MessageCode.AccountServer_Register){
        AccountRegister(message, res);
        return;
    }
    if(message.MessageCode == MessageCode.AccountServer_Login){
        AccountLogin(message, res)
        return;
    }
    if(message.MessageCode == MessageCode.AccountServer_LoginToken){
        AccountLoginTocken(message, res);
        return;
    }
}