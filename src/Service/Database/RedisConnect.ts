import { error } from "console";
import { createClient } from "redis";
import { Redis } from "../../Enviroment/Env";

export let redisClient = createClient({
  host: Redis.Host,
  port: Redis.Port,
  password: Redis.Password,
});


 export function InitRedisService(){
  console.log("redisClient connecting")
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

