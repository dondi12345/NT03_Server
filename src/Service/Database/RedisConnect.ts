import { error } from "console";
import { createClient } from "redis";
import { RedisConfig } from "../../Enviroment/Env";
import { Message } from "../../MessageServer/Model/Message";
import { DataModel } from "../../Utils/DataModel";
import { messageRouter } from "../../MessageServer/Router/MessageRouter";
import { TransferData } from "../../TransferData";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";

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
  console.log("redisClient connecting");

  redisClient.on("error", function (err) {
    console.log("redis went wrong " + err);
  });

  redisClient.on("connect", () => {
    console.log("connect redis success !");
  });
  redisSub.subscribe(RedisConfig.MessagePubSub);
  redisSub.on("message", (channel, data) => {
    logController.LogDev("Dev 1691208962 Listion on ", channel);
    var message = DataModel.Parse<Message>(data);
    logController.LogDev("Dev 1691208963: ", data, message);
    messageRouter.Router(message, new TransferData());
  });
}

class RedisControler {
  Set(key: string, value: string) {
    redisClient.set(key, value, (error, result) => {
      if (error) {
        logController.LogError(LogCode.Server_RedisSetFail, error, "Server");
      } else {
        logController.LogMessage(LogCode.Server_RedisSetSuccess, result +" "+key, "Server");
      }
    });
  }

  async Get(key: string) {
    var data = await new Promise(async (resolve, reject) => {
      await redisClient.get(key, (error, result) => { 
        if(error){
          resolve(null);
        }else{
          resolve(result)
        }
      });
    });
    if(data == null || data == undefined){
      logController.LogError(LogCode.Server_RedisGetNull, key, "Server");
      return null;
    }
    return data;
  }
}

export const redisControler = new RedisControler();
