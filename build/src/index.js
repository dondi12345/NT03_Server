"use strict";
/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WordService_1 = require("./MiniGameGuessWord/GuessWord/Service/WordService");
// Import arena config
(0, WordService_1.TestWord)();
