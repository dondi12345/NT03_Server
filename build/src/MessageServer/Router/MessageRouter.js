"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const CurrencyRouter_1 = require("../../Currency/Router/CurrencyRouter");
const UserPlayerRouter_1 = require("../../UserPlayerServer/Router/UserPlayerRouter");
const HeroRouter_1 = require("../../HeroServer/Router/HeroRouter");
const TDWaveRouter_1 = require("../../TDWave/Router/TDWaveRouter");
class MessageRouter {
    Router(message, transferData) {
        if (UserPlayerRouter_1.userPlayerRouter.Router(message, transferData))
            return;
        if (CurrencyRouter_1.currencyRouter.Router(message, transferData))
            return;
        if (HeroRouter_1.heroRouter.Router(message, transferData))
            return;
        if (TDWaveRouter_1.tdWaveRouter.Router(message, transferData))
            return;
    }
}
exports.messageRouter = new MessageRouter();
