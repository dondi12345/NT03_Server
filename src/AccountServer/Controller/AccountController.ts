import { CreateAccount, FindByUserName, IAccount, Account, AccountModel } from "../Model/Account";
import bcrypt from 'bcrypt'
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { AccountAuthen, IAccountAuthen } from "../Model/AccountAuthen";
import { AccountData } from "../Model/AccountData";
import { AccountTocken } from "../Model/AccountTocken";
import { GetToken, Verify } from "../../AuthenServer/AuthenController";
const saltRounds = 10;

export async function AccountRegister(message : IMessage) {
    try {
        var account = Account.Parse(message.Data);
        
        var isExisten = false;
        if(account.Username == null || account.Username == undefined) {
            return RegisterFailMessage(); 
        }
        await FindByUserName(account.Username).then(res=>{
            if(res == null || res == undefined) return;
            isExisten = true;
        })
        if(isExisten) {
            return RegisterFailMessage();
        }

        if(account.Password == null || account.Password == undefined){
            return RegisterFailMessage();
        }
        var pass = account.Password == undefined ? "" : account.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            account.Password = hash;
            CreateAccount(account).then((res: IAccount)=>{
                console.log("1684646335 "+ res);
                return RegisterSuccessMessage();
            })
        });
    } catch (error) {
        console.log("1684641453 "+error);
        return RegisterFailMessage();
    }
}

function RegisterFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_RegisterFail;
    return message;
}
function RegisterSuccessMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_RegisterSuccess;
    return message;
}

export async function AccountLogin(message:Message){
    console.log("1684684863 Login")
    var backMessage;
    try {
        var accountAuthen = AccountAuthen.Parse(message.Data);
        

        if(accountAuthen.Username == null || accountAuthen.Username == undefined || accountAuthen.Password == null || accountAuthen.Password== undefined){
            return LoginFailMessage();
        }
        else
        {
            await FindByUserName(accountAuthen.Username).then(async (res: IAccount)=>{
                if(res == null || res == undefined){
                    return await LoginFailMessage();
                }
                if(res.Password == null || res.Password == undefined){
                    return await LoginFailMessage();
                }
                bcrypt.compare(accountAuthen.Password.toString(), res.Password.toString(), async function(err, result) {
                    if(result){
                        console.log("1684684470 Login successfull: ")
                        backMessage = await LoginSuccessMessage(res, accountAuthen);
                        return;
                    }else{
                        console.log("1684684249 WrongPassword")
                        backMessage = await LoginFailMessage();
                        return;
                    }
                });
            })
        }
       
    } catch (error){
        console.log("1684684560 "+error);
    }
    console.log("1684927912 " + backMessage);
    return backMessage;
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginFail;
    return message;
}

function LoginSuccessMessage(account : IAccount, accountAuthen : IAccountAuthen){
    var accountData = new AccountData();
    accountData.IdAccount = account._id.toString();
    accountData.IdDevice = accountAuthen.IdDevice;

    var accountTocken = new AccountTocken();
    console.log(accountData);
    accountTocken.Token = GetToken({IdAccount : accountData.IdAccount, IdDevice : accountData.IdDevice});
    accountTocken.IdAccount = account._id.toString();

    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginSuccess;
    message.Data = accountTocken;
    return message;
}

export function AccountLoginTocken(message : Message){
    var accountTocken = AccountTocken.Parse(message.Data);
    var data = Verify(accountTocken.Token);
    if(data == null || data == undefined){
        return LoginFailMessage();
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != accountTocken.IdDevice) return LoginFailMessage();
        accountTocken.IdAccount = accountData.IdAccount;

        var message = new Message();
        message.MessageCode = MessageCode.AccountServer_LoginSuccess;
        message.Data = accountTocken;
    }
}