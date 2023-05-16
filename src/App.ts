//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import Init from './Service/Init';

import { scheduleJob } from 'node-schedule';
import { GetNewestResultRacingHourse } from './MiniGame/RacingHourse/Model/ResultRacingHourse';
import { GetTicketByIdResultRacingHourse } from './MiniGame/RacingHourse/Model/Ticket';
import mongoose from 'mongoose';

// Create Redis client
const redisClient = createClient();

// Define number of worker processes
const numCPUs = 2;

// Check if current process is master or worker
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(numCPUs);
  
  // Fork worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle exit of worker processes
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  let idRacingHourse = 0;
  Init.Init().then(res=>{
    const date = new Date(2023, 4, 16, 21, 52, 0);
    var id = new mongoose.Schema.Types.ObjectId("64464d995f152f402a21521d")
    // GetTicketByIdResultRacingHourse(id);
    // CreateRacingHourse().then(res=>{
    //   RacingHourse();
    // });
    RacingHourse();
    // const job = scheduleJob(date,()=> RacingHourse());
    // RacingHourse();
  })
} else {
  // Start child app
  // AppChild();
}
