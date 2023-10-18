import config from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import path from 'path';
import serveIndex from 'serve-index';
import express from 'express';

// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";

// Import demo room handlers
import { StateGuessWordRoom } from "./GuessWord/Model/GuessWordStateHandler";
import { StateSpellingBeeRoom } from "./SpellingBee/Model/SpellingBeeStateHandler";
import { Room_GPDefender as StateGamePlayDefender} from "../GamePlayDefender/Model/Room_GPDefender";
import { Room_AAC } from "../AxieAutoChess/Model/Room_AAC";

export const configGuessWord = config({
    options: {

    },

    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        // Define "state_handler" room
        gameServer.define("state_guess_number", StateGuessWordRoom).enableRealtimeListing();

        gameServer.define("state_spelling_bee", StateSpellingBeeRoom)
        gameServer.define("state_gameplay_defender", StateGamePlayDefender)
        gameServer.define("gameplay_aac",Room_AAC)

        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
        });


    },

    initializeExpress: (app) => {
        app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use('/', express.static(path.join(__dirname, "static")));

        // (optional) client playground
        // app.use('/playground', playground);

        // (optional) web monitoring panel
        app.use('/colyseus', monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
