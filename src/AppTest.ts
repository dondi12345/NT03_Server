import { DataVersion, DataVersionModel } from "./DataCenter/Model/DataVersion";
import { redisClient } from "./Service/Database/RedisConnect";
import Init from "./Service/Init";
import { tokenController } from "./Token/Controller/TockenController";

export function AppTest(){
    var hello = tokenController.AuthenGetTokenWithKey({data:"Hello"}, "Hello")
    console.log(tokenController.AuthenVerifyWithKey(hello, "Hello"))
}
