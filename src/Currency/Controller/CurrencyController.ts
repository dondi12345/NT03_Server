import { Types } from "mongoose";
import {logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import {Currency, CurrencyModel } from "../Model/Currency";
import { DataModel } from "../../Utils/DataModel";
import { redisControler } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";
import { TokenUserPlayer } from "../../Token/Model/TokenUserPlayer";
import { tokenController } from "../../Token/Controller/TockenController";

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

    async GetCurrencyCached(userPlayerID: string) {
        var currencyJson = await new Promise(async (reslove, rejects) => {
            reslove(await redisControler.Get(RedisKeyConfig.KeyCurrencyData(userPlayerID)))
        })
        if (currencyJson == null || currencyJson == undefined) {
            logController.LogError(LogCode.Currency_NotFoundInCache, userPlayerID, "Server")
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