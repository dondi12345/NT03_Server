import { error } from "console";
import { createClient } from "redis";
import { RedisConfig } from "../../Enviroment/Env";
import { Message } from "../../MessageServer/Model/Message";
import { DataModel } from "../../Utils/DataModel";
import { messageRouter } from "../../MessageServer/Router/MessageRouter";
import { TransferData } from "../../TransferData";
import { logController } from "../../LogServer/Controller/LogController";

export const redisClient = createClient({
  host: RedisConfig.Host,
  port: RedisConfig.Port,
  password: RedisConfig.Password,
});

export const redisPub = createClient({
  host: RedisConfig.Host,
  port: RedisConfig.Port,
  password: RedisConfig.Password,
});
export const redisSub = createClient({
  host: RedisConfig.Host,
  port: RedisConfig.Port,
  password: RedisConfig.Password,
});


export function InitRedisService() {
  console.log("redisClient connecting")

  redisClient.on('error', function (err) {
    console.log('redis went wrong ' + err);
  });

  redisClient.on("connect", () => {
    console.log('connect redis success !')
  })
  redisSub.subscribe(RedisConfig.MessagePubSub);
  redisSub.on("message", (channel, data)=>{
    logController.LogDev("Dev 1691208962 Listion on ",channel)
    var message = DataModel.Parse<Message>(data);
    logController.LogDev("Dev 1691208963: ",data, message)
    messageRouter.Router(message, new TransferData());
  })
}

