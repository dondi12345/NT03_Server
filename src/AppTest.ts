import { ChatChannel, CreateChatChannel, IChatChannel, TyppeChatChannelCode } from "./ChatServer/Model/ChatChannel";
import Init from "./Service/Init";

export function AppTest(){
    return;
    Init.InitDatabase().then(()=>{
        InitGlobalChatChannel();
    })
}

export async function InitGlobalChatChannel(){
    var globalChannel  = new ChatChannel();
    globalChannel.TyppeChatChannelCode = TyppeChatChannelCode.Global;
    globalChannel.Detail = "This global channel";
    await CreateChatChannel(globalChannel).then((res: IChatChannel)=>{
        console.log("1684583339 "+res._id);
    })
}
