import { Types } from "mongoose";
import { DataVersion, DataVersionModel } from "./DataCenter/Model/DataVersion";
import { HeroModel } from "./HeroServer/Model/Hero";
import { redisClient } from "./Service/Database/RedisConnect";
import Init from "./Service/Init";
import { tokenController } from "./Token/Controller/TockenController";

export function AppTest(){
    Init.InitDatabase().then(()=>{
        var idHero = new Types.ObjectId("647e13fb171e729eb469d17a")
        HeroModel.updateOne(
            {
                _id : idHero,
            },
            {
                $inc :{ Lv : 1}
            }
        ).then(res=>{
            console.log("=>>>", res)
        })
    })
}
