import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
import { Currency } from "../Model/Currency";
declare class CurrencyController {
    CurrencyLogin(message: Message, transferData: TransferData): Promise<Message>;
    AddCurrency(data: any, token: any): Promise<any>;
    GetCurrencyCached(userPlayerID: string): Promise<Currency>;
    SetCurrencyCached(currency: Currency): Promise<void>;
}
export declare const currencyController: CurrencyController;
export {};
