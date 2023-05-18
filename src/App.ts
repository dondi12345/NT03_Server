//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse, RacingHourseManager } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import Init from './Service/Init';
import mongoose, { Schema, Types } from 'mongoose';

// Create Redis client
const redisClient = createClient();

// Define number of worker processes
// const numCPUs = 2;
const numCPUs = require('os').cpus().length;

// Check if current process is master or worker
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(numCPUs);
  
  // Fork worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  console.log("create cluster");
  
  // Handle exit of worker processes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  let idRacingHourse = 0;
  Init.Init().then(res=>{
    
    RacingHourseManager();
    
  })
} else {
  // Start child app
  // AppChild();
}
