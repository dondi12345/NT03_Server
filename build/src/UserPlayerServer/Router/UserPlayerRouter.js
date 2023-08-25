"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPlayerRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const UserPlayerController_1 = require("../Controller/UserPlayerController");
class UserPlayerRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.UserPlayerServer_Login) {
            UserPlayerController_1.userPlayerController.UserPlayerLogin(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.UserPlayerServer_Logout) {
            UserPlayerController_1.userPlayerController.UserPlayerLogout(message);
            return true;
        }
        return false;
    }
}
exports.userPlayerRouter = new UserPlayerRouter();
