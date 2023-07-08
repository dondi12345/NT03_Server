import { Res } from "../../Res/Model/Res";
import { ResCode } from "../../Res/Model/ResCode";
import { ShopBuyCode } from "./ShopBuyCode";

export type ExchangeDataDictionary = Record<string, ShopBuyResByCurrency>;

export class ShopBuyResByCurrency{
    Code : ShopBuyCode;
    NameCurrency : ResCode = 0;
    Number : number = 0;
    ResIn : ResCode = 0;
    NumberIn : number = 0;

    static Parse(data) : ShopBuyResByCurrency{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}