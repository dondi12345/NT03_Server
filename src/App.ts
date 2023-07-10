// /nt/nt-03-server/NT03_Server
// 103.116.9.104
//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse, RacingHourseManager } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import mongoose, { Schema, Types } from 'mongoose';
import { API } from './AppAPI';
import { AppTest } from './AppTest';
import { InitAccountServer } from './AccountServer/Service/AccountService';
import Init from './Service/Init';
import { InitDailyLoginReward } from './DailyLoginReward/Service/DailyLoginRewardService';

// Create Redis client
const redisClient = createClient();

// Define number of worker processes
const numCPUs = 1;
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
    // AppTest();
    var date = new Date();
    console.log("Dev 1688975930 Server on: ", date.getUTCHours()+"/"+date.getUTCDate()+"/"+date.getUTCMonth()+"/"+date.getUTCFullYear());
    Init.InitDatabase().then((result) => {
      InitAccountServer();
      InitDailyLoginReward();
    }).catch((err) => {
      
    });
  } else {
    AppChild();
  }
}