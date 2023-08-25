"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const playground_1 = require("@colyseus/playground");
// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";
// Import demo room handlers
const StateHandler_1 = require("./StateHandler");
exports.default = (0, tools_1.default)({
    options: {
        devMode: true,
    },
    initializeGameServer: (gameServer) => {
        // Define "state_handler" room
        gameServer.define("state_handler", StateHandler_1.StateHandlerRoom)
            .enableRealtimeListing();
        gameServer.onShutdown(function () {
            console.log(`game server is going down.`);
        });
    },
    initializeExpress: (app) => {
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
