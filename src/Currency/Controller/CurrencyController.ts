import { Types } from "mongoose";
import { LogUserSocket, logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { TransferData } from "../../TransferData";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateUserPlayerCurrency, FindCurrencyByIdUserPlayer, ICurrency, Currency, UpdateCurrency, IncreaseNumber, CurrencyModel } from "../Model/Currency";
import { DataModel } from "../../Utils/DataModel";
import { userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { redisClient, redisConnect } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";

export async function CurrencyLogin(message : Message, userSocket: IUserSocket){
    await FindCurrencyByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        if(respone == null || respone == undefined){
            var currency = new Currency();
            currency.IdUserPlayer = userSocket.IdUserPlayer;
            await CreateUserPlayerCurrency(currency).then(respone=>{
                console.log("Dev 1684837963 " + respone)
                userSocket.Currency = respone;
                LogUserSocket(LogCode.Currency_LoginSuccess, userSocket, "", LogType.Normal)
                SendMessageToSocket(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
            }).catch((error)=>{
                LogUserSocket(LogCode.Currency_LoginFail, userSocket, error, LogType.Error)
                LoginFail(userSocket);
            })
        }else{
            console.log("Dev 1684837891 " + respone)
            userSocket.Currency = respone;
            LogUserSocket(LogCode.Currency_LoginSuccess, userSocket, "", LogType.Normal)
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
    try {
        LogUserSocket(LogCode.Currency_Update, userSocket, "", LogType.Normal);
        UpdateCurrency(userSocket.Currency, userSocket.IdUserPlayer);
        var messageBack : Message = new Message();
        messageBack.MessageCode = MessageCode.Currency_Update;
        messageBack.Data = JSON.stringify(userSocket.Currency);
        SendMessageToSocket(messageBack, userSocket.Socket);
    } catch (error) {
        LogUserSocket(LogCode.Currency_UpdateFail, userSocket, error, LogType.Error);
    }
}

class CurrencyController{
    async CurrencyLogin(message : Message, transferData: TransferData){
        var userPlayer = await userPlayerController.GetUserPlayerCached(transferData.Token);
        if(userPlayer == null || userPlayer == undefined){
            return LoginFail_New(transferData);
        }
        var currency = await FindByIdUserPlayer(userPlayer._id);
        if(currency == null|| currency == undefined){
            logController.LogDev("1685077925 Dev Not found currency")
            return LoginFail_New(transferData);
        }
        redisConnect.Set(RedisKeyConfig.KeyCurrencyData(userPlayer._id), JSON.stringify(currency));
        return LoginSuccess(currency, transferData);
    }

    async AddCurrency(idUserPlayer, data, token){
        var status = false;
        await CurrencyModel.updateOne(
            {
                IdUserPlayer : idUserPlayer
            },
            {
                $inc: data
            }
        ).then(res=>{
            logController.LogMessage(LogCode.Currency_AddSuccess, res, token);
            status = true;
        }).catch(err=>{
            logController.LogWarring(LogCode.Currency_AddFail, err, token);
        })
        return status;
    }
}

export const currencyController = new CurrencyController();

async function LoginSuccess(currency : Currency, transferData : TransferData){
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginSuccess;
    message.Data = JSON.stringify(currency)
    transferData.Send(JSON.stringify(message));
    return message;
}

async function LoginFail_New(transferData: TransferData) {
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginFail;
    transferData.Send(JSON.stringify(message));
    return message;
}

async function FindByIdUserPlayer(idUserPlayer: Types.ObjectId) {
    var data;
    await CurrencyModel.findOne({IdUserPlayer : idUserPlayer}).then((res)=>{
        data = res;
        logController.LogDev("1685077936 Dev ", res)
    }).catch(async err=>{
        logController.LogWarring(LogCode.Currency_NotFoundInDB, idUserPlayer+":"+err, "Server");
    })
    if(data == null || data == undefined){
        var currency = new Currency();
        currency.IdUserPlayer = idUserPlayer;
        await CurrencyModel.create(currency).then(res=>{
            data = res;
            logController.LogDev("1685077947 Dev ", res)
        }).catch(err=>{
            logController.LogWarring(LogCode.Currency_CreateNewFail, idUserPlayer+":"+err, "Server");
            data = null;
        })
    }
    return DataModel.Parse<Currency>(data)
}