//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';
import { CreateRacingHourse, RacingHourse } from './MiniGame/RacingHourse/Controller/RacingHourseCtroller';
import Init from './Service/Init';

import { scheduleJob } from 'node-schedule';
import { FindResultRacingHourse, GetNewestResultRacingHourse, IResultRacingHourse, ResultRacingHourse } from './MiniGame/RacingHourse/Model/ResultRacingHourse';
import { CreateTicket, GetTicketAndResultById, GetTicketById, GetTicketByIdResultRacingHourse, Ticket, UpdateRankOfTicket } from './MiniGame/RacingHourse/Model/Ticket';
import mongoose, { Schema, Types } from 'mongoose';

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
    const date = new Date(2023, 3, 24, 18, 1, 0);

    // var ticket = new Ticket();
    // ticket.idResultRacingHourse = new Types.ObjectId("64464d995f152f402a21521d");
    // ticket.idUser = new Types.ObjectId("64351f20cb49ccd25e90dda0");
    // ticket.numberHourse = 1;
    // CreateTicket(ticket);

    // var id = new mongoose.Types.ObjectId("64464d995f152f402a21521d")
    // GetTicketByIdResultRacingHourse(id);

    // GetTicketAndResultById(new Types.ObjectId("644a0b9bb0daec775d074c64"));
    
    // FindResultRacingHourse(new Types.ObjectId("64464d995f152f402a21521d")).then((res : IResultRacingHourse) =>{
    //   UpdateRankOfTicket(res)
    // });

    RacingHourse();

    // const job = scheduleJob(date,()=> RacingHourse());
  })
} else {
  // Start child app
  AppChild();
}
