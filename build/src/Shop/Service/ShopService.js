"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitShop = exports.exchangeDataDictionary = void 0;
const DataShop_1 = require("../DataShop");
const ShopBuyModel_1 = require("../Model/ShopBuyModel");
function InitShop() {
    exports.exchangeDataDictionary = {};
    DataShop_1.DataShop.forEach(element => {
        exports.exchangeDataDictionary[element.Code] = ShopBuyModel_1.ShopBuyResByCurrency.Parse(element);
    });
}
exports.InitShop = InitShop;
