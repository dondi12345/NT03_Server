//yarn ts-node ./src/App.ts
// Import necessary modules
import cluster from 'cluster';
import { createClient } from 'redis';
import {AppChild} from './AppChild';

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
} else {
  // Start child app
  AppChild();
}
