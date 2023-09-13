"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configGuessWord = void 0;
const arena_1 = __importDefault(require("@colyseus/arena"));
const monitor_1 = require("@colyseus/monitor");
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
const express_1 = __importDefault(require("express"));
// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";
// Import demo room handlers
const GuessWordStateHandler_1 = require("./GuessWord/Model/GuessWordStateHandler");
const SpellingBeeStateHandler_1 = require("./SpellingBee/Model/SpellingBeeStateHandler");
const Room_GPDefender_1 = require("../GamePlayDefender/Model/Room_GPDefender");
exports.configGuessWord = (0, arena_1.default)({
    options: {},
    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        // Define "state_handler" room
        gameServer.define("state_guess_number", GuessWordStateHandler_1.StateGuessWordRoom).enableRealtimeListing();
        gameServer.define("state_spelling_bee", SpellingBeeStateHandler_1.StateSpellingBeeRoom);
        gameServer.define("state_gameplay_defender", Room_GPDefender_1.Room_GPDefender);
        gameServer.onShutdown(function () {
            console.log(`game server is going down.`);
        });
    },
    initializeExpress: (app) => {
        app.use('/', (0, serve_index_1.default)(path_1.default.join(__dirname, "static"), { 'icons': true }));
        app.use('/', express_1.default.static(path_1.default.join(__dirname, "static")));
        // (optional) client playground
        // app.use('/playground', playground);
        // (optional) web monitoring panel
        app.use('/colyseus', (0, monitor_1.monitor)());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
