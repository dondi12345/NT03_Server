import { Login, Register } from "../Controller/AccountController";
import { IMSGAccount } from "../Model/MSGAccount";
import { MSGAccountCode } from "../Model/MSGAccountCode";

export function AccountRouter(msgAccount : IMSGAccount){
    if(msgAccount.MSGAccountCode == MSGAccountCode.Test){
        console.log("msgAccount Test Account")
    }
    if(msgAccount.MSGAccountCode == MSGAccountCode.Register){
        Register(msgAccount);
    }
    if(msgAccount.MSGAccountCode == MSGAccountCode.Login){
        Login(msgAccount);
    }
}