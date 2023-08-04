import { error } from "console";
import { createClient } from "redis";
import { RedisConfig } from "../../Enviroment/Env";

export let redisClient = createClient({
  host: RedisConfig.Host,
  port: RedisConfig.Port,
  password: RedisConfig.Password,
});


 export function InitRedisService(){
  console.log("redisClient connecting")
  redisClient = createClient({
    host: RedisConfig.Host,
    port: RedisConfig.Port,
    password: RedisConfig.Password,
  });
  redisClient.on('error', function (err) {
    console.log('redis went wrong ' + err);
  });
  
  redisClient.on("connect", () => {
    console.log('connect redis success !')
   })
 }

