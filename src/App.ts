// /nt/nt-03-server/NT03_Server
// 103.116.9.104
//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse, RacingHourseManager } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import mongoose, { Schema, Types } from 'mongoose';
import { API } from './AppAPI';
import { AppTest } from './AppTest';
import Init from './Service/Init';
import { InitDailyLoginReward } from './DailyLoginReward/Service/DailyLoginRewardService';
import { InitAPIServer } from './APIServer/Service/APIServerService';
import { InitAccountServer } from './AccountServer/Service/AccountService';
import { LogServer } from './LogServer/Controller/LogController';
import { LogCode } from './LogServer/Model/LogCode';
import { LogType } from './LogServer/Model/LogModel';
import { InitWebServer } from './WebServer';
import { dataCenterController } from './DataCenter/Controller/DataCenterController';
import { portConfig } from './Enviroment/Env';
import { listen } from '@colyseus/tools';
import { guessNumberService } from './MiniGame/GuessNumber/GuessNumberService';


// Define number of worker processes
const numCPUs = 1;
const version = "0.0.13"
// const numCPUs = require('os').cpus().length;
// AppTest();
InitApp();

// Check if current process is master or worker
function InitApp(){
  if (cluster.isMaster) {
    console.log(`Dev 1684475565 Master ${process.pid} is running`);
    console.log("Dev 1684475553 "+ numCPUs);

    // Fork worker processes
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    console.log("Dev 1684475633 create cluster");

    // Handle exit of worker processes
    cluster.on('1684475534 exit', (worker, code, signal) => {
      console.log(`Dev 1684475542 worker ${worker.process.pid} died`);
    });
    API();
    InitWebServer();
    AppTest();
    var date = new Date();
    var dateFormat = date.getUTCHours()+"/"+date.getUTCDate()+"/"+(date.getUTCMonth()+1)+"/"+date.getUTCFullYear()
    console.log("Dev 1688975930 Server", version," on: ", dateFormat);
    LogServer(LogCode.Server_ServerStart,JSON.stringify({Version : version, Time : dateFormat}), LogType.Normal);
    Init.InitDatabase().then((result) => {
      InitAPIServer();
      InitAccountServer();
      InitDailyLoginReward();
      dataCenterController;
    }).catch((err) => {

    });
  } else {
    AppChild();
  }
}