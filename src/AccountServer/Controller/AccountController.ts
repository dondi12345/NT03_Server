import bcrypt from 'bcrypt'
import { CreateAccount, FindByUserName, IAccount, Account, AccountModel, AccountLoginData, AccountRegisterData } from "../Model/Account";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { logController } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { TransferData } from '../../TransferData';
import { DataModel } from '../../Utils/DataModel';
import { TokenAccount } from '../../Token/Model/TokenAccount';
import { TokenModel } from '../../Token/Model/TokenModel';
import { tockenController } from '../../Token/Controller/TockenController';

const saltRounds = 10;

class AccountController{
    async AccountRegister(message:Message, transferData : TransferData) {
        try {
            var accountRegisterData = DataModel.Parse<AccountRegisterData>(message.Data);
     
            var isExisten = false;
            if(accountRegisterData.Username == null || accountRegisterData.Username == undefined) {
                transferData.Send(JSON.stringify(RegisterFailMessage("Inval Username")));
                return; 
            }
            await FindByUserName(accountRegisterData.Username).then(res=>{
                if(res == null || res == undefined) return;
                isExisten = true;
            })
            if(isExisten) {
                logController.LogWarring(LogCode.AccountServer_RegisterFail, "Account existen", accountRegisterData.Username);
                transferData.Send(JSON.stringify(RegisterFailMessage("Account existen")));
                return;
            }
    
            if(accountRegisterData.Password == null || accountRegisterData.Password == undefined){
                logController.LogWarring(LogCode.AccountServer_RegisterFail, "Wrong confirm password", accountRegisterData.Username);
                transferData.Send(JSON.stringify(RegisterFailMessage("Wrong confirm password")));
            }
            var pass = accountRegisterData.Password == undefined ? "" : accountRegisterData.Password+"";
            bcrypt.hash(pass, saltRounds, function(err, hash) {
                var account = new Account();
                account.Username = accountRegisterData.Username;
                account.Password = hash;
                CreateAccount(account).then((res: IAccount)=>{
                    console.log("Dev 1684646335 "+ res);
                    logController.LogMessage(LogCode.AccountServer_RegisterSuccess, accountRegisterData.Username, "Server");
                    transferData.Send(JSON.stringify(RegisterSuccessMessage()));
                })
            });
        } catch (error) {
            console.log("Dev 1684641453 "+error);
            logController.LogError(LogCode.AccountServer_RegisterFail, JSON.stringify(error), "Server");
            transferData.Send(JSON.stringify(RegisterFailMessage(error)));
        }
    }

    async AccountLogin(message:Message, transferData : TransferData){
        logController.LogDev("1684684863 Login");
        try {
            var accountLoginData = DataModel.Parse<AccountLoginData>(message.Data);        
    
            if(accountLoginData.Username == null || accountLoginData.Username == undefined || accountLoginData.Password == null || accountLoginData.Password== undefined){
                logController.LogDev("1684937233 error format")
                logController.LogWarring(LogCode.AccountServer_LoginFail,accountLoginData.Username+ " Inval format", "Server");
                transferData.Send(JSON.stringify(LoginFailMessage("Inval format")));
                return;
            }
            else
            {
                FindByUserName(accountLoginData.Username).then((res: Account)=>{
                    if(res == null || res == undefined){
                        logController.LogDev("1685266848 Account not found")
                        logController.LogWarring(LogCode.AccountServer_LoginFail, accountLoginData.Username +" Account not found", "Server")
                        transferData.Send(JSON.stringify(LoginFailMessage("Account not found")));
                        return;
                    }
                    if(res.Password == null || res.Password == undefined){
                        logController.LogDev("1685266848 Error password")
                        transferData.Send(JSON.stringify(LoginFailMessage("Error password")));
                        logController.LogWarring(LogCode.AccountServer_LoginFail,accountLoginData.Username+ " Error password", "Server")
                        return;
                    }
                    bcrypt.compare(accountLoginData.Password.toString(), res.Password.toString(), async function(err, result) {
                        if(result){
                            logController.LogDev("1684684470 Login successfull: ", res._id)

                            var tokenAccount = new TokenAccount();
                            tokenAccount.IdAccount = res._id.toString();
                            tokenAccount.IdDevice = accountLoginData.IdDevice;
                            
                            var tokenModel = new TokenModel();
                            try {
                                tokenModel.Token = tockenController.AuthenGetToken(JSON.parse(JSON.stringify(tokenAccount)))
                            } catch (error) {
                                console.log(error)
                            }
                            transferData.Send(JSON.stringify(LoginSuccessMessage(JSON.stringify(tokenModel))));
                            logController.LogMessage(LogCode.AccountServer_LoginSuccess, accountLoginData.Username.toString(), tokenModel.Token)
                            return;
                        }else{
                            logController.LogDev("1684684249 WrongPassword")
                            logController.LogWarring(LogCode.AccountServer_LoginFail, accountLoginData.Username +" WrongPassword", "Server")
                            transferData.Send(JSON.stringify(LoginFailMessage("WrongPassword")));
                            return;
                        }
                    });
                })
            }
           
        } catch (error){
            console.log("Dev 1684684560 "+error);
            logController.LogError(LogCode.AccountServer_LoginFail, error, "Server");
            transferData.Send(LoginFailMessage(error))
        }
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

function LoginFailMessage(error : string){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginFail;
    message.Data = error;
    return message;
}

function LoginSuccessMessage(data: string){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginSuccess;
    message.Data = data;
    return message;
}


export const accountController = new AccountController();
