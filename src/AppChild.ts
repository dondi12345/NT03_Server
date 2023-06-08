// Import necessary modules
import Init from "./Service/Init";
import { InitMessageServer } from "./MessageServer/Service/MessageService";
import { InitChatServer } from "./ChatServer/Service/ChatService";
import { GetIdUserPlayerByIdChatChannel } from "./ChatServer/Model/UserChatChannel";
import { Types } from "mongoose";
import { InitRes } from "./Res/Service/ResService";

// Function to create app child instance
export function AppChild() {
    console.log("1684561087 Init AppChild")
    Init.InitDatabase().then(()=>{
        InitMessageServer();
        InitChatServer();
        InitRes();
    }).catch(err=>{
        console.log(err);
    })
}