"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAccountServer = void 0;
const Account_1 = require("../Model/Account");
const node_schedule_1 = require("node-schedule");
function InitAccountServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // var timeSk = '0 0 */1 * * *'
        var timeSk = '0 0 */1 * * *';
        const countAccount = (0, node_schedule_1.scheduleJob)(timeSk, () => {
            (0, Account_1.CountAccount)((error, response) => {
                console.log("Dev 1689049933 Account:", response);
            });
        });
    });
}
exports.InitAccountServer = InitAccountServer;
