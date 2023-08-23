import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import path from 'path';
import serveIndex from 'serve-index';
import express from 'express';

// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";

// Import demo room handlers
import { StateGuessNumberRoom } from "./StateHandler";

export const configGuessNumber = config({
    options: {
        devMode: true,
    },

    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        // Define "state_handler" room
        gameServer.define("state_guess_number", StateGuessNumberRoom)
            .enableRealtimeListing();

        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
        });


    },

    initializeExpress: (app) => {
        app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use('/', express.static(path.join(__dirname, "static")));

        // (optional) client playground
        app.use('/playground', playground);

        // (optional) web monitoring panel
        app.use('/colyseus', monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
