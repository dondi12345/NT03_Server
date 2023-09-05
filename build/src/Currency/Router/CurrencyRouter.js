"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const CurrencyController_1 = require("../Controller/CurrencyController");
class CurrencyRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.Currency_Login) {
            CurrencyController_1.currencyController.CurrencyLogin(message, transferData);
            return true;
        }
        return false;
    }
}
exports.currencyRouter = new CurrencyRouter();
