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
import { redisClient, redisControler } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";
import { TokenUserPlayer } from "../../Token/Model/TokenUserPlayer";
import { tokenController } from "../../Token/Controller/TockenController";

export async function CurrencyLogin(message: Message, userSocket: IUserSocket) {
    await FindCurrencyByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone) => {
        if (respone == null || respone == undefined) {
            var currency = new Currency();
            currency.IdUserPlayer = userSocket.IdUserPlayer;
            await CreateUserPlayerCurrency(currency).then(respone => {
                console.log("Dev 1684837963 " + respone)
                userSocket.Currency = respone;
                LogUserSocket(LogCode.Currency_LoginSuccess, userSocket, "", LogType.Normal)
                SendMessageToSocket(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
            }).catch((error) => {
                LogUserSocket(LogCode.Currency_LoginFail, userSocket, error, LogType.Error)
                LoginFail(userSocket);
            })
        } else {
            console.log("Dev 1684837891 " + respone)
            userSocket.Currency = respone;
            LogUserSocket(LogCode.Currency_LoginSuccess, userSocket, "", LogType.Normal)
            SendMessageToSocket(LoginSuccessMessage(userSocket.Currency), userSocket.Socket);
        }
    }).catch(() => {
        LoginFail(userSocket);
    })
}

function LoginFail(userSocket: IUserSocket) {
    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
}

function LoginFailMessage() {
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginFail;
    return message;
}
function LoginSuccessMessage(res: ICurrency) {
    var message = new Message();
    message.MessageCode = MessageCode.Currency_LoginSuccess;
    message.Data = JSON.stringify(res);
    return message;
}

export function UpdateCurrencyCtrl(userSocket: IUserSocket) {
    try {
        LogUserSocket(LogCode.Currency_Update, userSocket, "", LogType.Normal);
        UpdateCurrency(userSocket.Currency, userSocket.IdUserPlayer);
        var messageBack: Message = new Message();
        messageBack.MessageCode = MessageCode.Currency_Update;
        messageBack.Data = JSON.stringify(userSocket.Currency);
        SendMessageToSocket(messageBack, userSocket.Socket);
    } catch (error) {
        LogUserSocket(LogCode.Currency_UpdateFail, userSocket, error, LogType.Error);
    }
}

class CurrencyController {
    async CurrencyLogin(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            return LoginFail_New(transferData);
        }
        var currency = await FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
        if (currency == null || currency == undefined) {
            logController.LogDev("1685077925 Dev Not found currency")
            return LoginFail_New(transferData);
        }
        redisControler.Set(RedisKeyConfig.KeyCurrencyData(tokenUserPlayer.IdUserPlayer), JSON.stringify(currency));
        return LoginSuccess(currency, transferData);
    }

    async AddCurrency(data, token) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(token);
        if (tokenUserPlayer == null) return null;
        var currency;
        await CurrencyModel.updateOne(
            {
                IdUserPlayer: tokenUserPlayer.IdUserPlayer
            },
            {
                $inc: data
            }
        ).then(async res => {
            logController.LogMessage(LogCode.Currency_AddSuccess, res, token);
            if (res.modifiedCount == 0) {
                logController.LogWarring(LogCode.Currency_AddNotFound, "", token);
                currency = null;
                return currency;
            } else {
                if (tokenUserPlayer == null) return;
                currency = await FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
                return currency;
            }
        }).catch(err => {
            logController.LogWarring(LogCode.Currency_AddFail, err, token);
            currency = null;
            return null;
        })
        return currency;
    }

    async GetCurrencyCached(token: string) {
        var tokenUserPlayer = DataModel.Parse<TokenUserPlayer>(tokenController.AuthenVerify(token));
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogDev("1684937365 wrong token");
            logController.LogWarring(LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", token);
            return new Currency();
        }
        var currencyJson = await new Promise(async (reslove, rejects) => {
            reslove(await redisControler.Get(RedisKeyConfig.KeyCurrencyData(tokenUserPlayer.IdUserPlayer)))
        })
        if (currencyJson == null || currencyJson == undefined) {
            return new Currency();;
        }
        return DataModel.Parse<Currency>(currencyJson)
    }

    async SetCurrencyCached(token: string, currency: Currency) {
        var data = DataModel.Parse<TokenUserPlayer>(tokenController.AuthenVerify(token));
        if (data == null || data == undefined) {
            logController.LogDev("1684937366 wrong token");
            logController.LogWarring(LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", token);
        } else {
            redisControler.Set(RedisKeyConfig.KeyCurrencyData(data.IdUserPlayer), JSON.stringify(currency));
        }
    }
}

export const currencyController = new CurrencyController();

async function LoginSuccess(currency: Currency, transferData: TransferData) {
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

async function FindByIdUserPlayer(idUserPlayer: string) {
    var data;
    await CurrencyModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
        data = res;
        logController.LogDev("1685077936 Dev ", res)
    }).catch(async err => {
        logController.LogWarring(LogCode.Currency_NotFoundInDB, idUserPlayer + ":" + err, "Server");
    })
    if (data == null || data == undefined) {
        var currency = new Currency();
        currency.IdUserPlayer = new Types.ObjectId(idUserPlayer);
        await CurrencyModel.create(currency).then(res => {
            data = res;
            logController.LogDev("1685077947 Dev ", res)
        }).catch(err => {
            logController.LogWarring(LogCode.Currency_CreateNewFail, idUserPlayer + ":" + err, "Server");
            data = null;
        })
    }
    var currency = DataModel.Parse<Currency>(data);
    redisControler.Set(RedisKeyConfig.KeyCurrencyData(idUserPlayer), JSON.stringify(currency))
    return currency;
}