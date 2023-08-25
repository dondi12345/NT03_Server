import { ResCode } from "../../Res/Model/ResCode";
import { ShopBuyCode } from "./ShopBuyCode";
export type ExchangeDataDictionary = Record<string, ShopBuyResByCurrency>;
export declare class ShopBuyResByCurrency {
    Code: ShopBuyCode;
    NameCurrency: ResCode;
    Number: number;
    ResIn: ResCode;
    NumberIn: number;
    static Parse(data: any): ShopBuyResByCurrency;
}
