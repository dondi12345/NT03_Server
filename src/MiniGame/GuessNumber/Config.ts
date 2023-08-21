import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";

// Import demo room handlers
import { StateHandlerRoom } from "./StateHandler";

export default config({
    options: {
        devMode: true,
    },

    initializeGameServer: (gameServer) => {

        // Define "state_handler" room
        gameServer.define("state_handler", StateHandlerRoom)
            .enableRealtimeListing();
        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
        });


    },

    initializeExpress: (app) => {
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
