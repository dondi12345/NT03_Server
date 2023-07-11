"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAccountServer = void 0;
const Env_1 = require("../../Enviroment/Env");
const express_1 = __importDefault(require("express"));
const AccountController_1 = require("../Controller/AccountController");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
function InitAccountServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get('/account', (req, res) => {
        res.send("Connect to AccountServer");
    });
    app.post('/account', (req, res) => {
        var message = Message_1.Message.Parse(req.body);
        if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Register) {
            (0, AccountController_1.AccountRegister)(message, res);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_Login) {
            (0, AccountController_1.AccountLogin)(message, res);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.AccountServer_LoginToken) {
            (0, AccountController_1.AccountLoginTocken)(message, res);
            return;
        }
    });
    app.listen(Env_1.port.portAccountServer, () => {
        console.log(`Dev 1686217636 Example app listening on port ${Env_1.port.portAccountServer}`);
    });
}
exports.InitAccountServer = InitAccountServer;
