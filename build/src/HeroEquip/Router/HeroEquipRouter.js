"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroEquipRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const HeroEquipController_1 = require("../Controller/HeroEquipController");
class HeroEquipRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Login) {
            HeroEquipController_1.heroEquipController.Login(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Craft) {
            HeroEquipController_1.heroEquipController.CraftEquip(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_UpgradeLv) {
            HeroEquipController_1.heroEquipController.UpgradeLv(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Wearing) {
            HeroEquipController_1.heroEquipController.WearingEquip(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroEquip_Unwearing) {
            HeroEquipController_1.heroEquipController.UnWearingEquip(message, transferData);
            return true;
        }
        return false;
    }
}
exports.heroEquipRouter = new HeroEquipRouter();
