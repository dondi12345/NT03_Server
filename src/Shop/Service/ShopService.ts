import { DataShop } from "../DataShop";
import { ShopBuyResByCurrency, ExchangeDataDictionary } from "../Model/ShopBuyModel";


export var exchangeDataDictionary : ExchangeDataDictionary;
export function InitShop(){
    exchangeDataDictionary = {};
    DataShop.forEach(element => {
        exchangeDataDictionary[element.Code] = ShopBuyResByCurrency.Parse(element);
    });
}