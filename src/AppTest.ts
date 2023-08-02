import { DataVersion, DataVersionModel } from "./DataCenter/Model/DataVersion";
import { redisClient } from "./Service/Database/RedisConnect";
import Init from "./Service/Init";

export function AppTest(){
    Init.InitDatabase().then(()=>{
        DataVersionModel.updateOne(
            {"Name": "TestData"},
            {
                $inc:{"Version": 1}
            }
        ).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })

        redisClient.incrby("NT03:Test", 1, (err,res)=>{
            if(err) console.log(err);
            else console.log(res);
        })
    })
}
