import bcrypt from 'bcrypt'
import { CreateAccount, FindByUserName, IAccount, Account, AccountModel } from "../Model/Account";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountAuthen, IAccountAuthen } from "../Model/AccountAuthen";
import { AccountData } from "../Model/AccountData";
import { AccountTocken } from "../Model/AccountTocken";
import { AuthenGetToken, AuthenVerify } from "../../AuthenServer/AuthenController";
import { TockenAuthen } from "../Model/TockenAuthen";

const saltRounds = 10;

export async function AccountRegister(message : IMessage, response) {
    try {
        var account = Account.Parse(message.Data);
        
        var isExisten = false;
        if(account.Username == null || account.Username == undefined) {
            response.send(RegisterFailMessage());
            return; 
        }
        await FindByUserName(account.Username).then(res=>{
            if(res == null || res == undefined) return;
            isExisten = true;
        })
        if(isExisten) {
            response.send(RegisterFailMessage());
            return;
        }

        if(account.Password == null || account.Password == undefined){
            response.send(RegisterFailMessage());
        }
        var pass = account.Password == undefined ? "" : account.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            account.Password = hash;
            CreateAccount(account).then((res: IAccount)=>{
                console.log("1684646335 "+ res);
                response.send(RegisterSuccessMessage());
            })
        });
    } catch (error) {
        console.log("1684641453 "+error);
        response.send(RegisterFailMessage());
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

export async function AccountLogin(message:Message, response){
    console.log("1684684863 Login")
    try {
        var accountAuthen = AccountAuthen.Parse(message.Data);
        

        if(accountAuthen.Username == null || accountAuthen.Username == undefined || accountAuthen.Password == null || accountAuthen.Password== undefined){
            console.log("1684937233 error format")
            response.send(JSON.stringify(LoginFailMessage()));
            return;
        }
        else
        {
            await FindByUserName(accountAuthen.Username).then((res: IAccount)=>{
                if(res == null || res == undefined){
                    response.send(JSON.stringify(LoginFailMessage()));
                    return;
                }
                if(res.Password == null || res.Password == undefined){
                    response.send(JSON.stringify(LoginFailMessage()));
                    return;
                }
                bcrypt.compare(accountAuthen.Password.toString(), res.Password.toString(), async function(err, result) {
                    if(result){
                        console.log("1684684470 Login successfull: ")
                        var accountData = new AccountData();
                        accountData.IdAccount = res._id.toString();
                        accountData.IdDevice = accountAuthen.IdDevice;

                        var accountTocken = new AccountTocken();
                        accountTocken.IdAccount = accountData.IdAccount;
                        accountTocken.Token = AuthenGetToken(JSON.parse(JSON.stringify(accountData)));

                        LoginSuccess(accountTocken, response);
                        return;
                    }else{
                        console.log("1684684249 WrongPassword")
                        response.send(JSON.stringify(LoginFailMessage()));
                        return;
                    }
                });
            })
        }
       
    } catch (error){
        console.log("1684684560 "+error);
        response.send(LoginFailMessage())
    }
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginFail;
    return message;
}

export function AccountLoginTocken(message : Message, response){
    var tockenAuthen = TockenAuthen.Parse(message.Data);
    var data = AuthenVerify(tockenAuthen.Token);
    if(data == null || data == undefined){
        response.send(LoginFailMessage());
        console.log("1684937265 wrong token")
        return;
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != tockenAuthen.IdDevice){
            console.log("1684937311 wrong device")
            response.send(LoginFailMessage());
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