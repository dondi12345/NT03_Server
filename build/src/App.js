"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /nt/nt-03-server/NT03_Server
// 103.116.9.104
//yarn ts-node ./src/App.ts
// Import necessary modules
const cluster_1 = __importDefault(require("cluster"));
const AppChild_1 = require("./AppChild");
const AppAPI_1 = require("./AppAPI");
const AppTest_1 = require("./AppTest");
const Init_1 = __importDefault(require("./Service/Init"));
const DailyLoginRewardService_1 = require("./DailyLoginReward/Service/DailyLoginRewardService");
const APIServerService_1 = require("./APIServer/Service/APIServerService");
const AccountService_1 = require("./AccountServer/Service/AccountService");
const LogController_1 = require("./LogServer/Controller/LogController");
const LogCode_1 = require("./LogServer/Model/LogCode");
const LogModel_1 = require("./LogServer/Model/LogModel");
const WebServer_1 = require("./WebServer");
const DataCenterService_1 = require("./DataCenter/Service/DataCenterService");
const GuessWord_1 = require("./MiniGameGuessWord/GuessWord");
// Define number of worker processes
const numCPUs = 1;
const version = "0.0.13";
// const numCPUs = require('os').cpus().length;
// AppTest();
InitApp();
// Check if current process is master or worker
function InitApp() {
    if (cluster_1.default.isMaster) {
        console.log(`Dev 1684475565 Master ${process.pid} is running`);
        console.log("Dev 1684475553 " + numCPUs);
        // Fork worker processes
        for (let i = 0; i < numCPUs; i++) {
            cluster_1.default.fork();
        }
        console.log("Dev 1684475633 create cluster");
        // Handle exit of worker processes
        cluster_1.default.on('1684475534 exit', (worker, code, signal) => {
            console.log(`Dev 1684475542 worker ${worker.process.pid} died`);
        });
        (0, AppAPI_1.API)();
        (0, WebServer_1.InitWebServer)();
        (0, AppTest_1.AppTest)();
        GuessWord_1.miniGameWord;
        // guessWordService
        var date = new Date();
        var dateFormat = date.getUTCHours() + "/" + date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
        console.log("Dev 1688975930 Server", version, " on: ", dateFormat);
        (0, LogController_1.LogServer)(LogCode_1.LogCode.Server_ServerStart, JSON.stringify({ Version: version, Time: dateFormat }), LogModel_1.LogType.Normal);
        Init_1.default.InitDatabase().then((result) => {
            (0, APIServerService_1.InitAPIServer)();
            (0, AccountService_1.InitAccountServer)();
            (0, DailyLoginRewardService_1.InitDailyLoginReward)();
            DataCenterService_1.dataCenterService;
        }).catch((err) => {
        });
    }
    else {
        (0, AppChild_1.AppChild)();
    }
}
