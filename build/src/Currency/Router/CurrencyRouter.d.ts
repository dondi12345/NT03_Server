import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class CurrencyRouter {
    Router(message: Message, transferData: TransferData): boolean;
}
export declare const currencyRouter: CurrencyRouter;
export {};
