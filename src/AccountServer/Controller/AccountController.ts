import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { SendToSocket } from "../Service/AccountService";
import { IMSGAccount, MSGAccount } from "../Model/MSGAccount";
import { MSGAccountCode } from "../Model/MSGAccountCode";
import { CreateAccount, FindByUserName, IAccount, Account, AccountModel } from "../Model/Account";
import bcrypt from 'bcrypt'
const saltRounds = 10;

export async function Register(msgAccount : IMSGAccount){
    try {
        var account = Account.Parse(msgAccount.Data);
        
        var isExisten = false;
        await FindByUserName(account).then(res=>{
            if(res == null || res == undefined) return;
            console.log("1684663921 Account Existen")
            var backMSGAccount = new MSGAccount();
            backMSGAccount.MSGAccountCode = MSGAccountCode.Account_Existen;
            backMSGAccount.Socket = msgAccount.Socket;
            SendToSocket(backMSGAccount, msgAccount.Socket);
            isExisten = true;
        })
        if(isExisten) return;

        if(account.Password == null || account.Password == undefined) return;
        var pass = account.Password == undefined ? "" : account.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            account.Password = hash;
            CreateAccount(account).then((res: IAccount)=>{
                console.log("1684646335 "+ res);
                var backMSGAccount = new MSGAccount();
                backMSGAccount.MSGAccountCode = MSGAccountCode.Register_Successful;
                backMSGAccount.Socket = msgAccount.Socket;
                SendToSocket(backMSGAccount, msgAccount.Socket);
            })
        });
    } catch (error) {
        console.log("1684641453 "+error);
    }
}

export async function Login(msgAccount : IMSGAccount) {
    console.log("1684684863 Login")
    try {
        var account = Account.Parse(msgAccount.Data);
        
        await FindByUserName(account).then((res: IAccount)=>{
            if(res != null && res != undefined) {
                var pass = account.Password == undefined ? "" : account.Password+"";
                var hash = res.Password == undefined ? "" : res.Password+"";
                bcrypt.compare(pass, hash, function(err, result) {
                    if(result){
                        console.log("1684684470 Login successfull")
                        var backMSGAccount = new MSGAccount();
                        backMSGAccount.MSGAccountCode = MSGAccountCode.Login_Success;
                        backMSGAccount.Socket = msgAccount.Socket;
                        SendToSocket(backMSGAccount, msgAccount.Socket);
                    }else{
                        console.log("1684684249 WrongPassword")
                        var backMSGAccount = new MSGAccount();
                        backMSGAccount.MSGAccountCode = MSGAccountCode.WrongPassword;
                        backMSGAccount.Socket = msgAccount.Socket;
                        SendToSocket(backMSGAccount, msgAccount.Socket);
                    }
                });
            }else{
                console.log("1684684932 WrongAccount")
                var backMSGAccount = new MSGAccount();
                backMSGAccount.MSGAccountCode = MSGAccountCode.Login_Fail;
                backMSGAccount.Socket = msgAccount.Socket;
                SendToSocket(backMSGAccount, msgAccount.Socket);
            }
        })
    } catch (error){
        console.log("1684684560 "+error);
    }
}