import { createClient } from "redis";
import { Redis } from "../../Enviroment/Env";

export const redisClient = createClient({
    host: Redis.Host,
    port: Redis.Port,
    password: Redis.Password,
  });
  
  
   export function ConnectRedisService(){
    redisClient.on('error', function (err) {
      console.log('redis went wrong ' + err);
    });
    
    redisClient.on("connect", () => {
      console.log('connect redis success !')
     })
   }