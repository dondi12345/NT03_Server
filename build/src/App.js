"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /nt/nt-03-server/NT03_Server
//yarn ts-node ./src/App.ts
// Import necessary modules
const cluster_1 = __importDefault(require("cluster"));
const redis_1 = require("redis");
const AppChild_1 = require("./AppChild");
const AppAPI_1 = require("./AppAPI");
const AccountService_1 = require("./AccountServer/Service/AccountService");
const Init_1 = __importDefault(require("./Service/Init"));
// Create Redis client
const redisClient = (0, redis_1.createClient)();
// Define number of worker processes
const numCPUs = 1;
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
        // AppTest();
        Init_1.default.InitDatabase().then((result) => {
            (0, AccountService_1.InitAccountServer)();
        }).catch((err) => {
        });
    }
    else {
        (0, AppChild_1.AppChild)();
    }
}
