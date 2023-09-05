"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const HeroController_1 = require("../Controller/HeroController");
class HeroRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.Hero_Login) {
            HeroController_1.heroController.Login(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.Hero_Summon) {
            HeroController_1.heroController.Summon(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.Hero_GetSummonResult) {
            HeroController_1.heroController.GetSummonResult(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.Hero_HireHero) {
            HeroController_1.heroController.HireHero(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.Hero_UpgradeLv) {
            HeroController_1.heroController.UpgradeLv(message, transferData);
            return true;
        }
        return false;
    }
}
exports.heroRouter = new HeroRouter();
