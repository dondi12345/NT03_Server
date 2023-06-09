// Import necessary modules
import Init from "./Service/Init";
import { InitMessageServerWithSocket } from "./MessageServer/Service/MessageService";
import { InitChatServer } from "./ChatServer/Service/ChatService";
import { GetIdUserPlayerByIdChatChannel } from "./ChatServer/Model/UserChatChannel";
import { Types } from "mongoose";
import { InitRes } from "./Res/Service/ResService";
import { InitHeroEquip } from "./HeroEquip/Service/HeroEquipService";
import { HeroModel } from "./HeroServer/Model/Hero";
import { InitHero } from "./HeroServer/Service/HeroService";
import { InitShop } from "./Shop/Service/ShopService";
import { InitDataVersion } from "./DataCenter/Service/DataCenterService";

// Function to create app child instance
export function AppChild() {
    console.log("Dev 1684561087 Init AppChild")
    Init.InitDatabase().then(()=>{
        InitMessageServerWithSocket();
        InitDataVersion();
        InitChatServer();
        InitHero();
        InitRes();
        InitHeroEquip();
        InitShop();
    }).catch(err=>{
        console.log(err);
    })
}