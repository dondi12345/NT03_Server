import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateUserPlayerCurrency, FindCurrencyByIdUserPlayer, ICurrency, Currency, UpdateCurrency, IncreaseNumber } from "../Model/Currency";

export async function CurrencyLogin(message : IMessage, userSocket: IUserSocket){
    await FindCurrencyByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        if(respone == null || respone == undefined){
            var currency = new Currency();
            currency.IdUserPlayer = userSocket.IdUserPlayer;
            await CreateUserPlayerCurrency(currency).then(respone=>{
                console.log("1684837963 " + respone)
                userSocket.Currency = respone;
                SendMessageToSocket(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
            }).catch(()=>{
                LoginFail(userSocket);
            })
        }else{
            console.log("1684837891 " + respone)
            userSocket.Currency = respone;
            SendMessageToSocket(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
        }
    }).catch(()=>{
        LoginFail(userSocket);
    })
}

function LoginFail(userSocket: IUserSocket){
    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginFail;
    return message;
}
function LoginSuccessMessage(res : ICurrency){
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginSuccess;
    message.Data = JSON.stringify(res);
    return message;
}

export function UpdateCurrencyCtrl(userSocket: IUserSocket){
    UpdateCurrency(userSocket.Currency, userSocket.IdUserPlayer);
    var messageBack : Message = new Message();
    messageBack.MessageCode = MessageCode.Currency_Update;
    messageBack.Data = JSON.stringify(userSocket.Currency);
    SendMessageToSocket(messageBack, userSocket.Socket);
}