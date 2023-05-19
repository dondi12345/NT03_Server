//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse, RacingHourseManager } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import Init from './Service/Init';
import mongoose, { Schema, Types } from 'mongoose';

import express from 'express';
import { MessageRawData } from './MessageServer/Router/MessageRouter';
const app = express()
const portAPI = 4000;

// Create Redis client
const redisClient = createClient();

// Define number of worker processes
const numCPUs = 1;
// const numCPUs = require('os').cpus().length;

API();

// Check if current process is master or worker
function InitApp(){
  if (cluster.isMaster) {
    console.log(`1684475565 Master ${process.pid} is running`);
    console.log("1684475553 "+ numCPUs);
    
    // Fork worker processes
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    console.log("1684475633 create cluster");
    
    // Handle exit of worker processes
    cluster.on('1684475534 exit', (worker, code, signal) => {
      console.log(`1684475542 worker ${worker.process.pid} died`);
    });
  
    let idRacingHourse = 0;
    Init.InitDatabase().then(res=>{
      
      // RacingHourseManager();
      
    })
    API();
  } else {
    // Start child app
    AppChild();
  }
}

function API(){
  app.use(express.json())
  app.get('/', (req, res) => {
      res.send("Hello");
    });
  app.post('/',(req, res)=>{
      console.log("1684475504 "+req.body);
      res.send("suc");
      MessageRawData(req.body);
  })
  app.listen(portAPI, () => {
      console.log(`1684475518 Example app listening on port ${portAPI}`)
    })
}