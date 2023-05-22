import { CreateAccount, FindByUserName, IAccount, Account, AccountModel } from "../Model/Account";
import bcrypt from 'bcrypt'
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
const saltRounds = 10;

export async function AccountRegister(message:Message, userSocket: IUserSocket) {
    try {
        var account = Account.Parse(message.Data);
        
        var isExisten = false;
        if(account.Username == null || account.Username == undefined) {
            SendMessageToSocket(RegisterFailMessage(), userSocket.Socket);
            return; 
        }
        await FindByUserName(account.Username).then(res=>{
            if(res == null || res == undefined) return;
            isExisten = true;
        })
        if(isExisten) {
            SendMessageToSocket(RegisterFailMessage(), userSocket.Socket);
            return; 
        }

        if(account.Password == null || account.Password == undefined){
            SendMessageToSocket(RegisterFailMessage(), userSocket.Socket);
            return;
        }
        var pass = account.Password == undefined ? "" : account.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            account.Password = hash;
            CreateAccount(account).then((res: IAccount)=>{
                console.log("1684646335 "+ res);
                SendMessageToSocket(RegisterSuccessMessage(), userSocket.Socket);
            })
        });
    } catch (error) {
        console.log("1684641453 "+error);
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

export async function AccountLogin(message:Message, userSocket: IUserSocket){
    console.log("1684684863 Login")
    try {
        var account = Account.Parse(message.Data);
        if(account.Username == null || account.Username == undefined || account.Password == null || account.Password== undefined){
            SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
            return;
        }
        
        await FindByUserName(account.Username).then((res: IAccount)=>{
            if(res == null || res == undefined){
                SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
                return;
            }
            if(res.Password == null || res.Password == undefined || account.Password == null || account.Password== undefined){
                SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
                return;
            }
            bcrypt.compare(account.Password.toString(), res.Password.toString(), function(err, result) {
                if(result){
                    userSocket.IdAccount = res._id;
                    console.log("1684684470 Login successfull: "+userSocket.IdAccount.toString())
                    SendMessageToSocket(LoginSuccessMessage(res), userSocket.Socket);
                return;
                }else{
                    console.log("1684684249 WrongPassword")
                    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
                    return;
                }
            });
        })
    } catch (error){
        console.log("1684684560 "+error);
    }
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginFail;
    return message;
}
function LoginSuccessMessage(account : IAccount){
    var message = new Message();
    message.MessageCode = MessageCode.AccountServer_LoginSuccess;
    message.Data = Account.ToString(account);
    return message;
}