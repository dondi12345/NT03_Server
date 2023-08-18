import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { currencyController } from "../Controller/CurrencyController";

class CurrencyRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.Currency_Login){
            currencyController.CurrencyLogin(message, transferData);
            return;
        }
    }
}

export const currencyRouter = new CurrencyRouter();