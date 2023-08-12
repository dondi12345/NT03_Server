import { Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import {currencyController } from "../../Currency/Controller/CurrencyController";
import {userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { TransferData } from "../../TransferData";
import { tdWaveController } from "../../TDWave/Controller/TDWaveController";
import { accountController } from "../../AccountServer/Controller/AccountController";

class MessageRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.UserPlayerServer_Login){
            userPlayerController.UserPlayerLogin(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.UserPlayerServer_Logout){
            userPlayerController.UserPlayerLogout(message);
            return;
        }
        if(message.MessageCode == MessageCode.Currency_Login){
            currencyController.CurrencyLogin(message, transferData);
            return;
        }
        if(message.MessageCode == MessageCode.TDWave_ProtectedSuccess){
            tdWaveController.ProtectedSuccessCtrl(message, transferData)
            return;
        }
        if(message.MessageCode == MessageCode.TDWave_ProtectedFail){
            tdWaveController.ProtectedFailCtrl(message, transferData);
            return;
        }
    }
}

export const messageRouter = new MessageRouter();