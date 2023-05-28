import { Types } from "mongoose";
import { ChatChannel, ChatChannelModel, CreateChatChannel, IChatChannel, TyppeChatChannelCode } from "./ChatServer/Model/ChatChannel";
import { UserJoinToChatChannel } from "./ChatServer/Model/UserChatChannel";
import Init from "./Service/Init";
import { UpdateRes } from "./ResServer/Model/Res";
import { CreateNewHero } from "./HeroServer/Controller/HeroController";

export function AppTest(){
    CreateNewHero()
    return;
    Init.InitDatabase().then(()=>{
        var data = [
            {
                "Name" : "Diamond",
                "Number":1
            },
            {
                "Name" : "Money",
                "Number":100
            }
            ]
        UpdateRes(data, new Types.ObjectId("646c93465a8fac2fbf4f542a"));
        // InitGlobalChatChannel();
        // InitPlayerChatChannel();
    })
}

export async function InitGlobalChatChannel(){
    var globalChannel  = new ChatChannel();
    globalChannel.TyppeChatChannelCode = TyppeChatChannelCode.Global;
    globalChannel.Detail = "This global channel";
    await ChatChannelModel.find({"TyppeChatChannelCode" : TyppeChatChannelCode.Global}).then(res=>{
        console.log("1684596348 "+res.length)
        if(res.length > 0) return;
        CreateChatChannel(globalChannel).then((res: IChatChannel)=>{
            console.log("1684583339 "+res._id);
        })
    })
}

export async function InitPlayerChatChannel() {
    UserJoinToChatChannel(new Types.ObjectId("6468e1dc24d4fe15f2f4dbf7"), new Types.ObjectId("6468b53dc6255c8fb16f8a9e"));
}
