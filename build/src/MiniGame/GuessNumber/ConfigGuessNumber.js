"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configGuessNumber = void 0;
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const playground_1 = require("@colyseus/playground");
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
const express_1 = __importDefault(require("express"));
// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";
// Import demo room handlers
const StateHandler_1 = require("./StateHandler");
exports.configGuessNumber = (0, tools_1.default)({
    options: {
        devMode: true,
    },
    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        // Define "state_handler" room
        gameServer.define("state_guess_number", StateHandler_1.StateGuessNumberRoom)
            .enableRealtimeListing();
        gameServer.onShutdown(function () {
            console.log(`game server is going down.`);
        });
    },
    initializeExpress: (app) => {
        app.use('/', (0, serve_index_1.default)(path_1.default.join(__dirname, "static"), { 'icons': true }));
        app.use('/', express_1.default.static(path_1.default.join(__dirname, "static")));
        // (optional) client playground
        app.use('/playground', playground_1.playground);
        // (optional) web monitoring panel
        app.use('/colyseus', (0, monitor_1.monitor)());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
