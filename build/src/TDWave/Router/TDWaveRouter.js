"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tdWaveRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const TDWaveController_1 = require("../Controller/TDWaveController");
class TDWaveRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.TDWave_ProtectedSuccess) {
            TDWaveController_1.tdWaveController.ProtectedSuccessCtrl(message, transferData);
            return true;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.TDWave_ProtectedFail) {
            TDWaveController_1.tdWaveController.ProtectedFailCtrl(message, transferData);
            return true;
        }
        return false;
    }
}
exports.tdWaveRouter = new TDWaveRouter();
