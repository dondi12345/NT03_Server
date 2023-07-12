"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAPIServer = void 0;
const Env_1 = require("../../Enviroment/Env");
const express_1 = __importDefault(require("express"));
const AccountServerRouter_1 = require("../../AccountServer/Router/AccountServerRouter");
const DataCenterRouter_1 = require("../../DataCenter/Router/DataCenterRouter");
function InitAPIServer() {
    console.log("Dev 1686217639 InitAPIServer");
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/account', (req, res) => {
        (0, AccountServerRouter_1.AccountServerRouter)(req.body, res);
    });
    app.post('/datacenter', (req, res) => {
        (0, DataCenterRouter_1.DataCenterRouter)(req.body, res);
    });
    app.listen(Env_1.port.portAPIServer, () => {
        console.log(`Dev 1686217637 APIServer listening on port ${Env_1.port.portAPIServer}`);
    });
}
exports.InitAPIServer = InitAPIServer;
