import { ChangeCurrency } from "../../Currency/Controller/CurrencyController";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { ChangeRes } from "../../Res/Controller/ResController";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { ShopBuyResByCurrency } from "../Model/ShopBuyModel";
import { exchangeDataDictionary } from "../Service/ShopService";


export function BuyResCtrlByCurrency(message : Message, userSocket : UserSocket){
    var exchange = ShopBuyResByCurrency.Parse(message.Data);
    var exchangeData = exchangeDataDictionary[exchange.Code];
    if(ChangeCurrency(exchangeData.NameCurrency.toString(), -exchangeData.Number, userSocket)){
        ChangeRes(exchangeData.ResIn, exchangeData.NumberIn, userSocket);
        var message = new Message();
        message.MessageCode = MessageCode.Shop_BuySuccess;
        SendMessageToSocket(message, userSocket.Socket);
    }else{
        var message = new Message();
        message.MessageCode = MessageCode.Shop_BuyFail;
        SendMessageToSocket(message, userSocket.Socket);
    }
}