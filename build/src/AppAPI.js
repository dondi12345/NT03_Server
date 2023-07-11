"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const socket_io_client_1 = require("socket.io-client");
const Env_1 = require("./Enviroment/Env");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
function API() {
    app.use(express_1.default.json());
    //MessageServer
    let socketMessage;
    let resMessage;
    app.get('/message', (req, res) => {
        socketMessage = (0, socket_io_client_1.io)("ws://" + Env_1.variable.localhost + ":" + Env_1.port.portMessageServer);
        socketMessage.on(Env_1.variable.eventSocketListening, (arg) => {
            console.log("Dev 1684561396 from MessageServer: " + JSON.stringify(arg));
        });
        socketMessage.on(Env_1.variable.eventSocketDisconnect, () => {
            console.log("Dev 1685084052 Drop connect from server");
        });
        res.send("Connect MessageServer");
    });
    app.post('/message', (req, res) => {
        if (socketMessage == null) {
            res.send("Not conect to MessageServer");
            return;
        }
        resMessage = res;
        console.log("Dev 1684475504 " + JSON.stringify(req.body));
        socketMessage.emit(Env_1.variable.eventSocketListening, JSON.stringify(req.body));
        res.send("suc");
    });
    //ChatServer
    let socketChat;
    app.get('/chat', (req, res) => {
        socketChat = (0, socket_io_client_1.io)("ws://" + Env_1.variable.localhost + ":" + Env_1.port.portChatServer);
        socketChat.on(Env_1.variable.eventSocketListening, (arg) => {
            console.log("Dev 1684568352 from ChatServer: " + arg);
        });
        res.send("Connect to ChatServer");
    });
    app.post('/chat', (req, res) => {
        if (socketChat == null) {
            res.send("Not connect to ChatServer");
            return;
        }
        console.log("Dev 1684568485 " + JSON.stringify(req.body));
        socketChat.emit(Env_1.variable.eventSocketListening, JSON.stringify(req.body));
        res.send("suc");
    });
    app.listen(Env_1.port.portAPI, () => {
        console.log(`Dev 1684475518 Example app listening on port ${Env_1.port.portAPI}`);
    });
}
exports.API = API;
