"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDailyLoginReward = void 0;
const Env_1 = require("../../Enviroment/Env");
const express_1 = __importDefault(require("express"));
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const DailyLoginRewardController_1 = require("../Controller/DailyLoginRewardController");
function InitDailyLoginReward() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get('/daily_login_reward', (req, res) => {
        res.send("Connect to DailyLoginReward");
    });
    app.post('/daily_login_reward', (req, res) => {
        var message = Message_1.Message.Parse(req.body);
        console.log("Dev 1688972193 Recive: ", req.body);
        if (message.MessageCode == MessageCode_1.MessageCode.DailyLoginReward_Login) {
            (0, DailyLoginRewardController_1.DailyLoginRewardLogin)(message, res);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.DailyLoginReward_Check) {
            (0, DailyLoginRewardController_1.DailyLoginRewardCheck)(message, res);
            return;
        }
    });
    app.listen(Env_1.port.portDailyLoginReward, () => {
        console.log(`Dev 1686217636 DailyLoginReward listening on port ${Env_1.port.portDailyLoginReward}`);
    });
}
exports.InitDailyLoginReward = InitDailyLoginReward;
