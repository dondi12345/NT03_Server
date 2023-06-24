import { Types } from "mongoose";
import { ChatChannel, ChatChannelModel, CreateChatChannel, IChatChannel, TyppeChatChannelCode } from "./ChatServer/Model/ChatChannel";
import { UserJoinToChatChannel } from "./ChatServer/Model/UserChatChannel";
import Init from "./Service/Init";
import { UpdateRes } from "./Res/Model/Res";
import { CreateNewHero } from "./HeroServer/Controller/HeroController";
import { CraftEquip } from "./HeroEquip/Controller/HeroEquipController";
import { Message } from "./MessageServer/Model/Message";
import { CraftHeroEquip } from "./HeroEquip/Model/HeroEquip";
import { ResCode } from "./Res/Model/ResCode";
import { CreateHero, Hero, HeroModel } from "./HeroServer/Model/Hero";

export function AppTest(){
    Init.InitDatabase().then(()=>{
        // HeroModel.deleteMany({HeroName : "Clone"}).then(res=>{
        //     // console.log(res);
        // })
    })
}

export async function InitGlobalChatChannel(){
    var globalChannel  = new ChatChannel();
    globalChannel.TyppeChatChannelCode = TyppeChatChannelCode.Global;
    globalChannel.Detail = "This global channel";
    await ChatChannelModel.find({"TyppeChatChannelCode" : TyppeChatChannelCode.Global}).then(res=>{
        console.log("Dev 1684596348 "+res.length)
        if(res.length > 0) return;
        CreateChatChannel(globalChannel).then((res: IChatChannel)=>{
            console.log("Dev 1684583339 "+res._id);
        })
    })
}

export async function InitPlayerChatChannel() {
    UserJoinToChatChannel(new Types.ObjectId("6468e1dc24d4fe15f2f4dbf7"), new Types.ObjectId("6468b53dc6255c8fb16f8a9e"));
}
