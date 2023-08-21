import { Types } from "mongoose";
import { DataVersion, DataVersionModel } from "./DataCenter/Model/DataVersion";
import { HeroModel } from "./HeroServer/Model/Hero";
import { redisClient } from "./Service/Database/RedisConnect";
import Init from "./Service/Init";
import { tokenController } from "./Token/Controller/TockenController";

export function AppTest(){
    
}
