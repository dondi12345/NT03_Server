import { createClient } from "redis";
import { Redis } from "../../Enviroment/Env";

export var redisClient;
  
  
   export function ConnectRedisService(){
    console.log("Redis connecting")
    redisClient = createClient({
        host: Redis.Host,
        port: Redis.Port,
        password: Redis.Password,
      });
    redisClient.on('error', function (err) {
      console.log('redis went wrong ' + err);
    });
    
    redisClient.on("connect", () => {
      console.log('connect redis success !')
     })
   }