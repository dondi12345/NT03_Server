import bcrypt from 'bcrypt'
import { CreateAccount, FindByUserName, IAccount, Account, AccountModel } from "../Model/Account";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountAuthen, IAccountAuthen } from "../Model/AccountAuthen";
import { AccountData } from "../Model/AccountData";
import { AccountTocken } from "../Model/AccountTocken";
import { AuthenGetToken, AuthenVerify } from "../../AuthenServer/AuthenController";
import { TockenAuthen } from "../Model/TockenAuthen";
import { LogServer } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';

const saltRounds = 10;

export async function AccountRegister(message : IMessage, response) {
    try {
        var account = Account.Parse(message.Data);
        
        var isExisten = false;
        if(account.Username == null || account.Username == undefined) {
            response.send(RegisterFailMessage("Inval Username"));
            return; 
        }
        await FindByUserName(account.Username).then(res=>{
            if(res == null || res == undefined) return;
            isExisten = true;
        })
        if(isExisten) {
            LogServer(LogCode.AccountServer_RegisterFail, "Account existen", LogType.Error);
            response.send(RegisterFailMessage("Account existen"));
            return;
        }

        if(account.Password == null || account.Password == undefined){
            LogServer(LogCode.AccountServer_RegisterFail, "Wrong confirm password", LogType.Error);
            response.send(RegisterFailMessage("Wrong confirm password"));
        }
        var pass = account.Password == undefined ? "" : account.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            account.Password = hash;
            CreateAccount(account).then((res: IAccount)=>{
                console.log("Dev 1684646335 "+ res);
                LogServer(LogCode.AccountServer_RegisterSuccess, "", LogType.Normal);
                response.send(RegisterSuccessMessage());
            })
        });
    } catch (error) {
        console.log("Dev 1684641453 "+error);
        LogServer(LogCode.AccountServer_RegisterFail, JSON.stringify(error), LogType.Error);
        response.send(RegisterFailMessage(error));
    }
}

function RegisterFailMessage(err : string){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_RegisterFail;
    message.Data = err 
    return message;
}
function RegisterSuccessMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_RegisterSuccess;
    return message;
}

export async function AccountLogin(message:Message, response){
    console.log("Dev 1684684863 Login")
    try {
        var accountAuthen = AccountAuthen.Parse(message.Data);
        

        if(accountAuthen.Username == null || accountAuthen.Username == undefined || accountAuthen.Password == null || accountAuthen.Password== undefined){
            console.log("Dev 1684937233 error format")
            LogServer(LogCode.AccountServer_LoginFail, "Inval format", LogType.Error)
            response.send(JSON.stringify(LoginFailMessage("Inval format")));
            return;
        }
        else
        {
            await FindByUserName(accountAuthen.Username).then((res: IAccount)=>{
                if(res == null || res == undefined){
                    console.log("Dev 1685266848 Account not found")
                    LogServer(LogCode.AccountServer_LoginFail, "Account not found", LogType.Error)
                    response.send(JSON.stringify(LoginFailMessage("Account not found")));
                    return;
                }
                if(res.Password == null || res.Password == undefined){
                    console.log("Dev 1685266848 Error password")
                    response.send(JSON.stringify(LoginFailMessage("Error password")));
                    LogServer(LogCode.AccountServer_LoginFail, "Error password", LogType.Error)
                    return;
                }
                bcrypt.compare(accountAuthen.Password.toString(), res.Password.toString(), async function(err, result) {
                    if(result){
                        console.log("Dev 1684684470 Login successfull: ")
                        var accountData = new AccountData();
                        accountData.IdAccount = res._id.toString();
                        accountData.IdDevice = accountAuthen.IdDevice;

                        var accountTocken = new AccountTocken();
                        accountTocken.IdAccount = accountData.IdAccount;
                        accountTocken.Token = AuthenGetToken(JSON.parse(JSON.stringify(accountData)));
                        LogServer(LogCode.AccountServer_LoginSuccess, accountAuthen.Username.toString(), LogType.Normal)
                        LoginSuccess(accountTocken, response);
                        return;
                    }else{
                        console.log("Dev 1684684249 WrongPassword")
                        LogServer(LogCode.AccountServer_LoginFail, "WrongPassword", LogType.Error)
                        response.send(JSON.stringify(LoginFailMessage("WrongPassword")));
                        return;
                    }
                });
            })
        }
       
    } catch (error){
        console.log("Dev 1684684560 "+error);
        LogServer(LogCode.AccountServer_LoginFail, error, LogType.Error);
        response.send(LoginFailMessage(error))
    }
}

function LoginFailMessage(error : string){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginFail;
    message.Data = error;
    return message;
}

export function AccountLoginTocken(message : Message, response){
    var tockenAuthen = TockenAuthen.Parse(message.Data);
    var data = AuthenVerify(tockenAuthen.Token);
    if(data == null || data == undefined){
        response.send(LoginFailMessage("Wrong token"));
        LogServer(LogCode.AccountServer_LoginFail, "Wrong token", LogType.Error)
        console.log("Dev 1684937265 wrong token")
        return;
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != tockenAuthen.IdDevice){
            console.log("Dev 1684937311 wrong device")
            LogServer(LogCode.AccountServer_LoginFail, "Wrong device", LogType.Error)
            response.send(LoginFailMessage("Wrong device"));
            return; 
        }

        var accountTocken = new AccountTocken();
        accountTocken.IdAccount = accountData.IdAccount;
        accountTocken.Token = tockenAuthen.Token;

        LoginSuccess(accountTocken, response);
    }
}

export function LoginSuccess(accountTocken : AccountTocken, response){

    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginSuccess;
    message.Data = JSON.stringify(accountTocken);
    response.send(JSON.stringify(message));
} 